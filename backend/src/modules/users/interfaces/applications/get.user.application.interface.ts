import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../entities/user.schema';
import { UserWithTeams } from '../type-user-with-teams';

export interface GetUserApplicationInterface {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	countUsers(): Promise<number>;

	getAllUsers(): Promise<LeanDocument<UserDocument>[]>;

	getAllUsersWithPagination(page: number, size: number): Promise<LeanDocument<UserDocument>[]>;

	getAllUsersWithTeams(
		page?: number,
		size?: number,
		searchUser?: string
	): Promise<{ userWithTeams: LeanDocument<UserWithTeams>[]; hasNextPage: boolean; page: number }>;

	getById(id: string): Promise<LeanDocument<UserDocument> | null>;
}
