const replaceAll = (value: string, find: string[], replace: string): string => {
	let replacedString = value;

	for (let i = 0; i < find.length; i++) {
		replacedString = replacedString.replace(find[i], replace);
	}

	return replacedString;
};

export { replaceAll };
