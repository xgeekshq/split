import { DeleteResult } from 'mongodb';
import {
	FilterQuery,
	PipelineStage,
	PopulateOptions,
	ProjectionType,
	QueryOptions,
	SortOrder,
	UpdateQuery
} from 'mongoose';
import { ModelProps, SelectedValues } from '../types';

export type PopulateType = PopulateOptions | (PopulateOptions | string)[];

export type SortType = string | { [key: string]: SortOrder } | [string, SortOrder][];

export interface BaseInterfaceRepository<T> {
	findAll(selectedValues?: SelectedValues<T>, sort?: SortType): Promise<T[]>;

	findOneById(id: any, selectedValues?: SelectedValues<T>, populate?: PopulateType): Promise<T>;

	findAllWithQuery(
		query: any,
		projection?: ProjectionType<T>,
		selectedValues?: SelectedValues<T>,
		populate?: PopulateType
	): Promise<T[]>;

	findOneByField(fields: ModelProps<T>): Promise<T>;

	findOneByFieldWithQuery(
		value: FilterQuery<T>,
		selectedValues?: SelectedValues<T>,
		populate?: PopulateType
	): Promise<T>;

	aggregateByQuery<Q>(pipeline: PipelineStage[]): Promise<Q[]>;

	create<Q>(item: Q, withSession?: boolean): Promise<T>;

	insertMany<Q>(listOfItems: Q[], withSession?: boolean): Promise<T[]>;

	update(id: string, item: T): Promise<T>;

	deleteMany(field: FilterQuery<T>, withSession: boolean): Promise<number>;

	countDocuments(): Promise<number>;

	countDocumentsWithQuery(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<number>;

	findOneByFieldAndUpdate(
		value: FilterQuery<T>,
		query: UpdateQuery<T>,
		options?: QueryOptions<T>,
		populate?: PopulateType,
		withSession?: boolean
	): Promise<T>;

	findOneAndRemoveByField(fields: ModelProps<T>, withSession: boolean): Promise<T>;

	findOneByeFieldAndDelete(value: FilterQuery<T>, options?: QueryOptions): Promise<T>;

	updateOneByField<Q>(
		filter: FilterQuery<T>,
		update: UpdateQuery<T>,
		options?: QueryOptions<T>,
		withSession?: boolean
	): Promise<Q>;

	deleteOneWithQuery(value: FilterQuery<T>, options?: QueryOptions): Promise<DeleteResult>;

	startTransaction(): Promise<void>;

	commitTransaction(): Promise<void>;

	abortTransaction(): Promise<void>;

	endSession(): Promise<void>;

	findByIdAndDelete(id: string, withSession: boolean): Promise<T>;
}
