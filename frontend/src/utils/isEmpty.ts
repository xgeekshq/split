export type None = null | undefined;

export type EmptyObject = Record<string, never>;

export type Empty = None | false | 0 | '' | [] | EmptyObject;

const isEmpty = (value: unknown): value is Empty => {
	if ([null, undefined, 'undefined'].includes(value as string | null | undefined)) {
		return true;
	}

	if (Array.isArray(value) && value.length === 0) {
		return true;
	}

	if (typeof value === 'object' && Object.keys(value || {}).length === 0) {
		return true;
	}

	if (['', 0, '0', false].includes(value as string | number | boolean)) {
		return true;
	}

	return false;
};

export default isEmpty;
