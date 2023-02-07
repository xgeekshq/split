export const hideText = (text: string): string => {
	return text.replace(/[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\u1000-\uFFFF]/g, 'a');
};
