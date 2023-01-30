/* eslint-disable padding-line-between-statements */
export const get_nth_suffix = (date: number): string => {
	switch (date) {
		case 1:
		case 21:
		case 31:
			return 'st';
		case 2:
		case 22:
			return 'nd';
		case 3:
		case 23:
			return 'rd';
		default:
			return 'th';
	}
};
