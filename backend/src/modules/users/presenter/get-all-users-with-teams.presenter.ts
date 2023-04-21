import { UserWithTeams } from 'src/modules/users/interfaces/type-user-with-teams';

export class GetAllUsersWithTeamsPresenter {
	userWithTeams: UserWithTeams[];
	userAmount: number;
	hasNextPage: boolean;
	page: number;
}
