import { DeleteResult } from 'mongodb';
import {
	ClientSession,
	FilterQuery,
	Model,
	PipelineStage,
	ProjectionType,
	QueryOptions,
	UpdateQuery
} from 'mongoose';
import {
	BaseInterfaceRepository,
	PopulateType,
	SortType
} from '../interfaces/base.repository.interface';
import { ModelProps, SelectedValues } from '../types';

export class MongoGenericRepository<T> implements BaseInterfaceRepository<T> {
	protected _repository: Model<T>;
	protected _session: ClientSession;

	constructor(repository: Model<T>) {
		this._repository = repository;
	}

	countDocuments(): Promise<number> {
		return this._repository.countDocuments().lean().exec();
	}

	countDocumentsWithQuery(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<number> {
		return this._repository.countDocuments(filter, options).lean().exec();
	}

	findAll(
		selectedValues?: SelectedValues<T>,
		sort?: SortType,
		populate?: PopulateType
	): Promise<T[]> {
		return this._repository.find().select(selectedValues).sort(sort).populate(populate).exec();
	}

	findOneById(id: any, selectedValues?: SelectedValues<T>, populate?: PopulateType): Promise<T> {
		return this._repository
			.findById(id)
			.select(selectedValues)
			.populate(populate)
			.lean({ virtuals: true })
			.exec() as Promise<T>;
	}

	findOneByField(value: ModelProps<T>): Promise<T> {
		return this._repository.findOne(value).exec();
	}

	findOneByFieldWithQuery(
		value: FilterQuery<T>,
		selectedValues?: SelectedValues<T>,
		populate?: PopulateType
	): Promise<T> {
		return this._repository
			.findOne(value)
			.select(selectedValues)
			.populate(populate)
			.exec() as Promise<T>;
	}

	findAllWithQuery(
		query: FilterQuery<T>,
		projection?: ProjectionType<T>,
		selectedValues?: SelectedValues<T>,
		populate?: PopulateType,
		virtuals = true
	): Promise<T[]> {
		return this._repository
			.find(query, projection)
			.select(selectedValues)
			.populate(populate)
			.lean({ virtuals: virtuals })
			.exec() as unknown as Promise<T[]>;
	}

	aggregateByQuery<Q>(pipeline: PipelineStage[]): Promise<Q[]> {
		return this._repository.aggregate(pipeline).exec();
	}

	create<Q>(item: Q): Promise<T> {
		return this._repository.create(item);
	}

	insertMany<Q>(listOfItems: Q[]): Promise<T[]> {
		return this._repository.insertMany(listOfItems);
	}

	update(id: string, item: T): Promise<T> {
		return this._repository.findByIdAndUpdate(id, item).exec();
	}

	findOneByFieldAndUpdate(
		value: FilterQuery<T>,
		query: UpdateQuery<T>,
		options?: QueryOptions<T>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<T> {
		return this._repository
			.findOneAndUpdate(value, query, {
				...options,
				session: withSession ? this._session : undefined
			})
			.populate(populate)
			.lean({ virtuals: populate ? true : false })
			.exec() as unknown as Promise<T>;
	}

	findOneAndRemove(id: string, withSession = false): Promise<T> {
		return this._repository
			.findOneAndRemove(
				{
					_id: id
				},
				{ session: withSession ? this._session : undefined }
			)
			.exec();
	}

	findOneAndRemoveByField(fields: ModelProps<T>, withSession: boolean): Promise<T> {
		return this._repository
			.findOneAndRemove(fields, {
				session: withSession ? this._session : undefined
			})
			.exec();
	}

	findByIdAndDelete(id: string, withSession: boolean): Promise<T> {
		return this._repository
			.findByIdAndDelete(id, {
				session: withSession ? this._session : undefined
			})
			.exec();
	}

	findOneByeFieldAndDelete(value: FilterQuery<T>, options?: QueryOptions): Promise<T> {
		return this._repository.findOneAndDelete(value, options).exec();
	}

	updateOneByField<Q>(
		filter: FilterQuery<T>,
		update: UpdateQuery<T>,
		options?: QueryOptions<T>,
		withSession?: boolean
	): Promise<Q> {
		return this._repository
			.updateOne(filter, update, {
				...options,
				session: withSession ? this._session : undefined
			})
			.lean()
			.exec() as unknown as Promise<Q>;
	}

	async deleteMany(field: FilterQuery<T>, withSession = false): Promise<number> {
		const { deletedCount } = await this._repository
			.deleteMany(field, { session: withSession ? this._session : undefined })
			.exec();

		return deletedCount;
	}

	async deleteManyWithAcknowledged(field: FilterQuery<T>, withSession = false): Promise<DeleteResult> {
		return this._repository
		.deleteMany(field, { session: withSession ? this._session : undefined })
		.exec();
	}

	deleteOneWithQuery(value: FilterQuery<T>, options?: QueryOptions): Promise<DeleteResult> {
		return this._repository.deleteOne(value, options).exec();
	}

	async startTransaction() {
		this._session = await this._repository.db.startSession();
		this._session.startTransaction();
	}

	async commitTransaction() {
		await this._session.commitTransaction();
	}

	async abortTransaction() {
		await this._session.abortTransaction();
	}

	async endSession() {
		await this._session.endSession();
	}
}
