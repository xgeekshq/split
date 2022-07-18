import { LeanDocument } from 'mongoose';

import { UserDocument } from '../../schemas/user.schema';

export interface GetUserService {
	getByEmail(email: string): Promise<LeanDocument<UserDocument> | null>;

	getById(id: string): Promise<LeanDocument<UserDocument> | null>;

	getUserIfRefreshTokenMatches(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | false>;

	countUsers(): Promise<number>;
}
