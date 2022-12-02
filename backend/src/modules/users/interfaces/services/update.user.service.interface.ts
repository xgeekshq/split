import { LeanDocument } from 'mongoose';
import UpdateUserDto from '../../dto/update.user.dto';
import { UserDocument } from '../../schemas/user.schema';

export interface UpdateUserService {
	setCurrentRefreshToken(refreshToken: string, userId: string): Promise<UserDocument | null>;

	setPassword(
		userEmail: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<UserDocument | null>;

	checkEmail(token: string): Promise<string>;

	updateSuperAdmin(user: UpdateUserDto): Promise<LeanDocument<UserDocument>>;
}
