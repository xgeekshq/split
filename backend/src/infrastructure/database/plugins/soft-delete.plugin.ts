import { DeleteOptions, DeleteResult } from 'mongodb';
import mongoose, {
	Document,
	FilterQuery,
	Model,
	MongooseDefaultQueryMiddleware,
	MongooseDocumentMiddleware,
	MongooseQueryMiddleware,
	Query,
	QueryOptions,
	Schema
} from 'mongoose';

export type TSoftDelete<T> = T & {
	isDeleted: boolean;
	deletedAt?: Date | null;
};

export interface SoftDeleteModel<T> extends Model<TSoftDelete<T>> {
	countDeleted(query?: FilterQuery<T>): Promise<number>;
	findDeleted(query?: FilterQuery<T>): Promise<Array<TSoftDelete<T>>>;
	forceDelete(query: FilterQuery<T>, options?: QueryOptions<any>): Promise<DeleteResult>;
	restore(query: FilterQuery<T>): Promise<Array<T>>;
	softDelete(query: FilterQuery<T>, options?: QueryOptions<T>): Promise<Array<T>>;
}

type TSoftDeleteDocument = TSoftDelete<Document>;

//Used to inject data into the query object to count deleted documents to be used in post hook to return that value
type SoftDeleteQuery = Query<any, any> & {
	deletedCount: number;
	isForceDelete: boolean;
	op: string;
};

//Find hooks for pre
const findTypesQueryMiddleware = [
	'count',
	'countDocuments',
	'delete',
	'deleteOne',
	'deleteMany',
	'find',
	'findOne',
	'findOneAndDelete',
	'findOneAndRemove',
	'findOneAndReplace',
	'findOneAndUpdate',
	'remove',
	'replaceOne',
	'update',
	'updateOne',
	'updateMany'
];

//Delete hooks for pre "query"
const deleteTypesQueryMiddleware = [
	'delete',
	'deleteMany',
	'deleteOne',
	'findOneAndDelete',
	'findOneAndRemove',
	'remove'
];

//Delete hooks for pre "document"
const deleteTypesDocumentMiddleware = ['delete', 'deleteOne', 'remove'];

export function SoftDeletePlugin(schema: Schema) {
	schema.add({
		isDeleted: {
			type: Boolean,
			required: true,
			default: false
		},
		deletedAt: {
			type: Date,
			default: null
		}
	});

	//Add isDeleted field to query if it doesn't exist
	schema.pre(
		findTypesQueryMiddleware as Array<MongooseQueryMiddleware>,
		async function softDeleteFind() {
			if (this instanceof Query && !('isDeleted' in this.getFilter())) {
				this.setQuery({ ...this.getFilter(), isDeleted: { $ne: true } });
			}
		}
	);

	schema.pre('aggregate', async function softDeleteAggregate() {
		this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
	});

	//Soft-delete documents
	schema.pre(
		deleteTypesQueryMiddleware as Array<MongooseQueryMiddleware>,
		{ query: true, document: false },
		async function softDelete(this: SoftDeleteQuery) {
			this.deletedCount = 0;
			this.isForceDelete = false;

			if (this instanceof Query && !('isDeleted' in this.getFilter())) {
				this.setQuery({ ...this.getFilter(), isDeleted: { $ne: true } });
			}

			if (!('forceDelete' in this.getFilter())) {
				//Mongoose changes the query operation type after the find from 'delete*' to 'find',
				//that needs to be re-set to 'delete*' for post hooks to run
				const op = this.op;

				const docs: Array<TSoftDeleteDocument> = await this.find(
					this.getQuery(),
					undefined,
					this.getOptions()
				)
					.clone()
					.exec();

				for (const doc of docs) {
					doc.isDeleted = true;
					doc.deletedAt = new Date();
					doc.$isDeleted(true);

					await doc.save({ session: this.getOptions().session });

					this.deletedCount++;
				}

				//Re-setting query operation type
				this.op = op;
			} else {
				this.isForceDelete = true;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { forceDelete, isDeleted, ...rest } = this.getFilter();
				this.setQuery({ ...rest });
			}
		}
	);

	schema.pre(
		deleteTypesDocumentMiddleware as Array<MongooseDocumentMiddleware>,
		{ document: true, query: false },
		async function softDelete() {
			this.isDeleted = true;
			this.deletedAt = new Date();
			this.$isDeleted(true);
			await this.save();
		}
	);

	schema.post(
		['deleteOne', 'deleteMany', 'remove'] as Array<MongooseDefaultQueryMiddleware>,
		async function postDelete(this: SoftDeleteQuery): Promise<DeleteResult> {
			if (!this.isForceDelete) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { isDeleted, ...query } = this.getFilter();
				this.setQuery({ ...query, isDeleted: true });

				return (mongoose as any).overwriteMiddlewareResult({
					acknowledged: true,
					deletedCount: this.deletedCount
				});
			}
		}
	);
	schema.post(
		['findOneAndRemove', 'findOneAndDelete'] as Array<MongooseQueryMiddleware>,
		{ query: true, document: false },
		async function postFindRemove(): Promise<TSoftDeleteDocument> {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { isDeleted, ...query } = this.getFilter();
			this.setQuery({ ...query, isDeleted: true });
			const doc = await this.findOne(this.getQuery()).clone().exec();

			return (mongoose as any).overwriteMiddlewareResult(doc);
		}
	);

	//Helper to find deleted documents
	schema.static(
		'findDeleted',
		async function findDeleted(query?: FilterQuery<TSoftDelete<any>>): Promise<number> {
			if (!query) {
				query = {};
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { isDeleted, ...rest } = query;
			query = { ...rest, isDeleted: true };

			return this.find(query).clone().exec();
		}
	);

	schema.static(
		'countDeleted',
		async function countDeleted(query?: FilterQuery<TSoftDelete<any>>): Promise<number> {
			if (!query) {
				query = {};
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { isDeleted, ...rest } = query;
			query = { ...rest, isDeleted: true };

			return this.countDocuments(query).clone().exec();
		}
	);

	//Helper to restore documents
	schema.static('restore', async function restore(query: FilterQuery<TSoftDelete<any>>): Promise<
		Array<TSoftDelete<Document & any>>
	> {
		query.isDeleted = true;

		return this.updateMany(query, {
			$set: {
				isDeleted: false,
				deletedAt: null
			}
		});
	});

	//Helper to force delete documents
	schema.static(
		'forceDelete',
		async function forceDelete(
			query: FilterQuery<any>,
			options?: DeleteOptions
		): Promise<DeleteResult> {
			if (!('forceDelete' in query)) {
				query = { ...query, forceDelete: true };
			}

			return this.deleteMany(query, options);
		}
	);

	//Helper to soft delete documents
	schema.static('softDelete', async function softDelete<
		T
	>(query: FilterQuery<T>, options?: QueryOptions<T>): Promise<Array<TSoftDelete<Document & T>>> {
		const docs: Array<TSoftDelete<Document & T>> = await this.find(query, null, options)
			.clone()
			.exec();
		for (const doc of docs) {
			doc.isDeleted = true;
			doc.deletedAt = new Date();
			doc.$isDeleted(true);
			await doc.save(options);
		}

		return docs;
	});
}
