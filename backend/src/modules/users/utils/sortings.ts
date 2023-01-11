import User from '../entities/user.schema';

export const sortAlphabetically = (a: User, b: User) => {
	if (a.firstName === b.firstName) {
		return a.lastName < b.lastName ? -1 : 1;
	}

	return a.firstName < b.firstName ? -1 : 1;
};
