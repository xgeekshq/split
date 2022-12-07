import { UpdateQuery } from 'mongoose';
import { ModelProps, SelectedValues } from '../types';

export interface BaseInterfaceRepository<T> {
	findAll(selectedValues?: SelectedValues<T>): Promise<T[]>;

	findOneById(id: any, selectedValues?: SelectedValues<T>, populate?: any): Promise<T>;

	findAllWithQuery(query: any, selectedValues?: SelectedValues<T>, populate?: any): Promise<T[]>;

	findOneByField(fields: ModelProps<T>): Promise<T>;

	create(item: T): Promise<T>;

	update(id: string, item: T);

	deleteMany(field: ModelProps<T>, withSession: boolean): Promise<number>;

	countDocuments(): Promise<number>;

	findOneByFieldAndUpdate(value: ModelProps<T>, query: UpdateQuery<T>): Promise<T>;

	findOneAndRemoveByField(fields: ModelProps<T>, withSession: boolean): Promise<T>;

	startTransaction();

	commitTransaction();

	abortTransaction();

	endSession();
}
