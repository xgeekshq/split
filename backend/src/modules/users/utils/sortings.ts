import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import User from '../entities/user.schema';

export const sortAlphabetically = (a: User, b: User) => {
	if (a.firstName.toLowerCase() === b.firstName.toLowerCase()) {
		return a.lastName.toLowerCase() < b.lastName.toLowerCase() ? -1 : 1;
	}

	return a.firstName.toLowerCase() < b.firstName.toLowerCase() ? -1 : 1;
};

export const sortTeamUserListAlphabetically = (listToSort: any[]) => {
	listToSort.sort((a: TeamUser, b: TeamUser) => {
		return sortAlphabetically(a.user as User, b.user as User);
	});

	return listToSort;
};
