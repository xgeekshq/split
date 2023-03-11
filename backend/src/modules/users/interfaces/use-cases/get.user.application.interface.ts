import User from '../../entities/user.schema';
import { UserWithTeams } from '../type-user-with-teams';

export interface GetUserApplicationInterface {
	getByEmail(email: string): Promise<User | null>;

	countUsers(): Promise<number>;

	getAllUsers(): Promise<User[]>;

	getAllUsersWithPagination(page: number, size: number): Promise<User[]>;

	getAllUsersWithTeams(
		page?: number,
		size?: number,
		searchUser?: string
	): Promise<{ userWithTeams: UserWithTeams[]; hasNextPage: boolean; page: number }>;

	getById(id: string): Promise<User | null>;
}
