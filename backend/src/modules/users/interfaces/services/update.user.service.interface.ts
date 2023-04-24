import User from '../../entities/user.schema';

export interface UpdateUserServiceInterface {
	setCurrentRefreshToken(refreshToken: string, userId: string): Promise<User>;

	setPassword(userEmail: string, newPassword: string, newPasswordConf: string): Promise<User>;

	checkEmailOfToken(token: string): Promise<string>;

	updateUserAvatar(avatar: string, userId: string): Promise<User>;

	updateUserUpdatedAtField(user: string): Promise<User>;
}
