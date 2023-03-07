export type ObjectOfAny = Record<string, any>;

/**
 * Enforces a fixed size hardcoded array.
 * @see https://github.com/microsoft/TypeScript/issues/18471#issuecomment-776636707 for the source of the solution.
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787 another approach, that might be useful if the one above shows any limitation.
 * @example
 * const fixedArray: FixedSizeArray<string, 3> = ['a', 'b', 'c'];
 */
export type FixedLengthArray<T, N extends number> = N extends N
	? number extends N
		? T[]
		: FixedLengthArrayRecursive<T, N, []>
	: never;
type FixedLengthArrayRecursive<T, N extends number, R extends unknown[]> = R['length'] extends N
	? R
	: FixedLengthArrayRecursive<T, N, [T, ...R]>;
