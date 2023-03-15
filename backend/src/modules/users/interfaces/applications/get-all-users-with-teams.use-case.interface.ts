import { UserWithTeams } from '../type-user-with-teams';

export interface GetAllUsersWithTeamsUseCaseInterface {
	execute(
		page: number,
		size: number,
		searchUser?: string
	): Promise<{
		userWithTeams: UserWithTeams[];
		userAmount: number;
		hasNextPage: boolean;
		page: number;
	}>;
}
