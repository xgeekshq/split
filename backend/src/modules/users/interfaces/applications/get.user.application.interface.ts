import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../entities/user.schema';
import { UserWithTeams } from '../type-user-with-teams';

export interface GetUserApplication {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	countUsers(): Promise<number>;

	getAllUsers(): Promise<LeanDocument<UserDocument>[]>;

	getUsersOnlyWithTeams(): Promise<LeanDocument<UserWithTeams>[]>;
}
