import User from 'src/modules/users/entities/user.schema';

export interface ValidateUserAuthServiceInterface {
	validateUserWithCredentials(email: string, plainTextPassword: string): Promise<User | null>;

	validateUserById(userId: string): Promise<User | null>;

	validateUserByRefreshToken(authorization: string, userId: string): Promise<false | User>;
}
