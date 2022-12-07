import { ClientSession, Model, UpdateQuery } from 'mongoose';
import { BaseInterfaceRepository, PopulateType } from '../interfaces/base.repository.interface';
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

	findAll(selectedValues?: SelectedValues<T>, populate?: PopulateType): Promise<T[]> {
		return this._repository.find().select(selectedValues).populate(populate).exec();
	}

	findOneById(id: any, selectedValues?: SelectedValues<T>, populate?: PopulateType): Promise<T> {
		return this._repository
			.findById(id)
			.select(selectedValues)
			.populate(populate)
			.exec() as Promise<T>;
	}

	findOneByField(value: ModelProps<T>): Promise<T> {
		return this._repository.findOne(value).exec();
	}

	findAllWithQuery(
		query: any,
		selectedValues?: SelectedValues<T>,
		populate?: PopulateType
	): Promise<T[]> {
		return this._repository
			.find(query)
			.select(selectedValues)
			.populate(populate)
			.lean({ virtuals: true })
			.exec() as unknown as Promise<T[]>;
	}

	create(item: T): Promise<T> {
		return this._repository.create(item);
	}

	update(id: string, item: T): Promise<T> {
		return this._repository.findByIdAndUpdate(id, item).exec();
	}

	findOneByFieldAndUpdate(value: ModelProps<T>, query: UpdateQuery<T>): Promise<T> {
		return this._repository.findOneAndUpdate(value, query, { new: true }).exec();
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

	async deleteMany(field: ModelProps<T>, withSession = false): Promise<number> {
		const { deletedCount } = await this._repository
			.deleteMany(field, { session: withSession ? this._session : undefined })
			.exec();

		return deletedCount;
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
