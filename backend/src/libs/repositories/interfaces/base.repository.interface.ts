import { QueryOptions, UpdateQuery } from 'mongoose';
import { ModelProps, SelectedValues } from '../types';

export interface BaseInterfaceRepository<T> {
	getAll(selectedValues?: SelectedValues<T>): Promise<T[]>;

	get(id: string, selectedValues?: SelectedValues<T>): Promise<T>;

	create(item: T): Promise<T>;

	update(id: string, item: T);

	getByProp(value: ModelProps<T>): Promise<T>;

	countDocuments(): Promise<number>;

	findOneByFieldAndUpdate(
		value: ModelProps<T>,
		query: UpdateQuery<T>,
		options?: QueryOptions<T>
	): Promise<T>;
}
