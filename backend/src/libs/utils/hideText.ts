export const hideText = (text: string): string => {
	return text.replace(/[a-zA-Z\d'#]/g, 'a');
};
