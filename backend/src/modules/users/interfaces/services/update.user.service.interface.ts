import User from '../../entities/user';

export interface UpdateUserService {
	setCurrentRefreshToken(refreshToken: string, userId: string): Promise<User | null>;

	setPassword(
		userEmail: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<User | null>;

	checkEmail(token: string): Promise<string>;
}
