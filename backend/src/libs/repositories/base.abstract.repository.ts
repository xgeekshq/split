import { BaseInterfaceRepository } from './interfaces/base.repository.interface';

export abstract class BaseAbstractRepository<T> implements BaseInterfaceRepository<T> {
	abstract getAll(selectedValues?: string): Promise<T[]>;

	abstract get(id: string, selectedValues?: string): Promise<T>;

	abstract create(item: T): Promise<T>;

	abstract update(id: string, item: T);

	abstract getByProp(value: any): Promise<T>;

	abstract countDocuments(): Promise<number>;

	abstract findOneByFieldAndUpdate(value: any, query: any): Promise<T>;
}
