import { LeanDocument } from 'mongoose';
import User, { UserDocument } from '../../entities/user.schema';

export interface UpdateUserServiceInterface {
	setCurrentRefreshToken(refreshToken: string, userId: string): Promise<User | null>;

	setPassword(
		userEmail: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<User | null>;

	checkEmail(token: string): Promise<string>;

	updateUserAvatar(avatar: string, userId: string): Promise<LeanDocument<UserDocument>>;

	updateUserUpdatedAtField(user: string): Promise<User>;
}
