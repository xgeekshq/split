const STRINGS_TO_REPLACE = ['ObjectId'];

const getIdFromObjectId = (id: string): string => {
	let replacedId = id;

	for (let i = 0; i < STRINGS_TO_REPLACE.length; i++) {
		replacedId = replacedId.replace(STRINGS_TO_REPLACE[i], '');
	}

	return replacedId;
};

export { getIdFromObjectId };
