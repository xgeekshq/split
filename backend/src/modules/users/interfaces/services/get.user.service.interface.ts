import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../entities/user.schema';
import { UserWithTeams } from '../type-user-with-teams';

export interface GetUserServiceInterface {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	getById(id: string): Promise<LeanDocument<UserDocument> | null>;

	getUserIfRefreshTokenMatches(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | false>;

	countUsers(): Promise<number>;

	getAllUsers(): Promise<LeanDocument<UserDocument>[]>;

	getAllUsersWithPagination(page: number, size: number): Promise<LeanDocument<UserDocument>[]>;

	getAllUsersWithTeams(
		page?: number,
		size?: number,
		searchUser?: string
	): Promise<{ userWithTeams: LeanDocument<UserWithTeams>[]; hasNextPage: boolean; page: number }>;
}
