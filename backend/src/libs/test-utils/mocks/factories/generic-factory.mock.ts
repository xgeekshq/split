import range from 'src/libs/utils/range';
import { FixedLengthArray, ObjectOfAny } from 'src/libs/utils/types';

const DEFAULT_CREATE_MANY_COUNT = 10;

export type BuildTestFactoryCountValue = number | 'random';

export type BuildTestFactoryGetterProps<TModel> = (index: number) => Partial<TModel>;

export type BuildTestFactoryArrayProps<TModel, TCount extends number> = FixedLengthArray<
	Partial<TModel>,
	TCount
>;

type BuildTestFactoryProps<
	TModel,
	TCount extends BuildTestFactoryCountValue
> = TCount extends number
	? BuildTestFactoryGetterProps<TModel> | BuildTestFactoryArrayProps<TModel, TCount>
	: BuildTestFactoryGetterProps<TModel>;

const isGetterProps = <TModel>(props: unknown): props is BuildTestFactoryGetterProps<TModel> =>
	typeof props === 'function';

const isArrayProps = <TModel>(props: unknown, index: number): props is Array<TModel> =>
	Array.isArray(props) && index < props.length;

const getOverrideProps = <TModel, TCount extends number>(
	props: BuildTestFactoryProps<TModel, TCount> | undefined,
	index: number
): Partial<TModel> => {
	let overrideProps: Partial<TModel> = {};

	if (isGetterProps<TModel>(props)) {
		overrideProps = props(index);
	} else if (isArrayProps<TModel>(props, index)) {
		overrideProps = props[index];
	}

	return overrideProps;
};

function getItemCount(count?: BuildTestFactoryCountValue): number {
	if (!count) return DEFAULT_CREATE_MANY_COUNT;

	if (count === 'random') return Math.floor(Math.random() * 100) + 1;

	return count;
}

/**
 * Provides functions to create items from a given factory.
 * @example
 *
 * const UserFactory = buildTestFactory<{ name: string, age: number }>((index) => ({
 *   name: faker.name.firstName(),
 *   age: faker.datatype.number(1, index === 0 ? 50 : 100),
 * }));
 * // single item
 * UserFactory.create();
 * // single item with overriden props
 * UserFactory.create({ name: 'John' });
 * // multiple items
 * UserFactory.createMany(3);
 * // multiple items with overriden props on every item
 * UserFactory.createMany(3, () => ({ name: 'John' }));
 * // multiple items with overriden props per index
 * UserFactory.createMany(3, [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }]);
 */
export const buildTestFactory = <TModel extends ObjectOfAny>(
	factory: (index?: number) => TModel
) => ({
	create: (props?: Partial<TModel>): TModel => ({ ...factory(), ...props }),
	createMany: <TCount extends BuildTestFactoryCountValue>(
		count?: TCount,
		props?: BuildTestFactoryProps<TModel, TCount>
	): TModel[] =>
		range(1, getItemCount(count)).map((_, index) => ({
			...factory(index),
			...getOverrideProps(props, index)
		}))
});
