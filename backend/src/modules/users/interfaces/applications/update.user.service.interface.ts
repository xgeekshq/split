import { LeanDocument } from 'mongoose';
import User, { UserDocument } from '../../entities/user.schema';

export interface UpdateUserApplication {
	setCurrentRefreshToken(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | null>;

	setPassword(
		userEmail: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<User | null>;

	checkEmail(token: string): Promise<string>;
}
