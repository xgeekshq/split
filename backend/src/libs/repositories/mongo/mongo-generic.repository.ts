import { Model } from 'mongoose';
import { BaseAbstractRepository } from '../base.abstract.repository';

export class MongoGenericRepository<T> implements BaseAbstractRepository<T> {
	private _repository: Model<T>;
	private _populateOnFind: string[];

	constructor(repository: Model<T>, populateOnFind: string[] = []) {
		this._repository = repository;
		this._populateOnFind = populateOnFind;
	}

	getAll(selectedValues?: string): Promise<T[]> {
		return this._repository.find().select(selectedValues).populate(this._populateOnFind).exec();
	}

	get(id: any, selectedValues?: string): Promise<T> {
		return this._repository
			.findById(id)
			.select(selectedValues)
			.populate(this._populateOnFind)
			.exec() as Promise<T>;
	}

	getByProp(value: any): Promise<T> {
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

	findOneByFieldAndUpdate(value: any, query: any): Promise<T> {
		return this._repository.findOneAndUpdate(value, query).exec();
	}
}
