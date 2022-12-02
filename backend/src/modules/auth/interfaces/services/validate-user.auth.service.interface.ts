import UserModel from 'src/modules/users/entities/user';

export interface ValidateUserAuthService {
	validateUserWithCredentials(email: string, plainTextPassword: string): Promise<UserModel | null>;

	validateUserById(userId: string): Promise<UserModel | null>;

	validateUserByRefreshToken(authorization: string, userId: string): Promise<false | UserModel>;
}
