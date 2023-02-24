import { FixedLengthArray, ObjectOfAny } from '@/types/utils';
import range from '@/utils/range';

export type BuildTestFactoryGetterProps<TModel extends unknown> = (
  index: number,
) => Partial<TModel>;
export type BuildTestFactoryArrayProps<
  TModel extends unknown,
  TCount extends number,
> = FixedLengthArray<Partial<TModel>, TCount>;
type BuildTestFactoryProps<TModel extends unknown, TCount extends number> =
  | BuildTestFactoryGetterProps<TModel>
  | BuildTestFactoryArrayProps<TModel, TCount>;

const isGetterProps = <TModel extends unknown>(
  props: unknown,
): props is BuildTestFactoryGetterProps<TModel> => typeof props === 'function';

const isArrayProps = <TModel extends unknown>(
  props: unknown,
  index: number,
): props is Array<TModel> => Array.isArray(props) && index < props.length;

const getOverrideProps = <TModel extends unknown, TCount extends number>(
  props: BuildTestFactoryProps<TModel, TCount> | undefined,
  index: number,
): Partial<TModel> => {
  let overrideProps: Partial<TModel> = {};
  if (isGetterProps<TModel>(props)) {
    overrideProps = props(index);
  } else if (isArrayProps<TModel>(props, index)) {
    overrideProps = props[index];
  }
  return overrideProps;
};

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
  factory: (index?: number) => TModel,
) => ({
  create: (props?: Partial<TModel>): TModel => ({ ...factory(), ...props }),
  createMany: <TCount extends number>(
    count = 10 as TCount,
    props?: BuildTestFactoryProps<TModel, TCount>,
  ): TModel[] =>
    range(1, count).map((_, index) => ({ ...factory(index), ...getOverrideProps(props, index) })),
});
