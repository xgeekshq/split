import { Model, QueryOptions, UpdateQuery } from 'mongoose';
import { BaseInterfaceRepository } from '../interfaces/base.repository.interface';
import { ModelProps, SelectedValues } from '../types';

export class MongoGenericRepository<T> implements BaseInterfaceRepository<T> {
	private _repository: Model<T>;
	private _populateOnFind: string[];

	constructor(repository: Model<T>, populateOnFind: string[] = []) {
		this._repository = repository;
		this._populateOnFind = populateOnFind;
	}

	getAll(selectedValues?: SelectedValues<T>): Promise<T[]> {
		return this._repository.find().select(selectedValues).populate(this._populateOnFind).exec();
	}

	get(id: any, selectedValues?: SelectedValues<T>): Promise<T> {
		return this._repository
			.findById(id)
			.select(selectedValues)
			.populate(this._populateOnFind)
			.exec() as Promise<T>;
	}

	getByProp(value: ModelProps<T>): Promise<T> {
		return this._repository.findOne(value).exec();
	}

	create(item: T): Promise<T> {
		return this._repository.create(item);
	}

	update(id: string, item: T) {
		return this._repository.findByIdAndUpdate(id, item);
	}

	countDocuments(): Promise<number> {
		return this._repository.countDocuments().exec();
	}

	findOneByFieldAndUpdate(
		value: ModelProps<T>,
		query: UpdateQuery<T>,
		options?: QueryOptions<T>
	): Promise<T> {
		return this._repository.findOneAndUpdate(value, query, options).exec();
	}
}
