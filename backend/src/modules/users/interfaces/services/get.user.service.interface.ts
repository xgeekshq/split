import { LeanDocument } from 'mongoose';
import User, { UserDocument } from 'src/modules/users/entities/user.schema';

export interface GetUserServiceInterface {
	getUserIfRefreshTokenMatches(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | false>;

	getByEmail(email: string, checkDeleted?: boolean): Promise<User>;

	getById(id: string): Promise<User>;

	countUsers(): Promise<number>;
}
