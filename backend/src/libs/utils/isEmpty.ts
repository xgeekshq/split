export type None = null | undefined;

export type EmptyObject = Record<string, never>;

export type Empty = None | false | 0 | '' | [] | EmptyObject;

const isEmpty = (value: unknown): value is Empty => {
	if (
		[null, undefined, 'undefined', '', 0, '0', false].includes(
			value as string | number | null | undefined | false
		)
	) {
		return true;
	}

	if (Array.isArray(value) && value.length === 0) {
		return true;
	}

	if (typeof value === 'object' && Object.keys(value || {}).length === 0) {
		return true;
	}

	return false;
};

export default isEmpty;
