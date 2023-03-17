import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../entities/user.schema';

export interface GetUserServiceInterface {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	getById(id: string): Promise<LeanDocument<UserDocument> | null>;

	getUserIfRefreshTokenMatches(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | false>;

	countUsers(): Promise<number>;
}
