import { LeanDocument } from 'mongoose';
import UpdateUserDto from '../../dto/update.user.dto';
import User, { UserDocument } from '../../entities/user.schema';

export interface UpdateUserService {
	setCurrentRefreshToken(refreshToken: string, userId: string): Promise<User | null>;

	setPassword(
		userEmail: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<User | null>;

	checkEmail(token: string): Promise<string>;

	updateSuperAdmin(user: UpdateUserDto): Promise<LeanDocument<UserDocument>>;
}
