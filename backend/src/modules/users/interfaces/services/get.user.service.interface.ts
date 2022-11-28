import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
import { UserWithTeams } from '../type-user-with-teams';

export interface GetUserService {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	getById(id: string): Promise<LeanDocument<UserDocument> | null>;

	getUserIfRefreshTokenMatches(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | false>;

	countUsers(): Promise<number>;

	getAllUsers(): Promise<LeanDocument<UserDocument>[]>;

	getAllUsersWithTeams(): Promise<LeanDocument<UserWithTeams>[]>;
}
