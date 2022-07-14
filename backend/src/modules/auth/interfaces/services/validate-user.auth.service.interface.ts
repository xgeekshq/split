import { LeanDocument } from 'mongoose';

import { UserDocument } from 'modules/users/schemas/user.schema';

export interface ValidateUserAuthService {
	validateUserWithCredentials(
		email: string,
		plainTextPassword: string
	): Promise<LeanDocument<UserDocument> | null>;

	validateUserById(userId: string): Promise<LeanDocument<UserDocument> | null>;

	validateUserByRefreshToken(
		authorization: string,
		userId: string
	): Promise<false | LeanDocument<UserDocument>>;
}
