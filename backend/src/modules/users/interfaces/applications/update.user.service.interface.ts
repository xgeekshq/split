import { LeanDocument } from 'mongoose';
import UpdateUserDto from '../../dto/update.user.dto';
import User, { UserDocument } from '../../entities/user.schema';
import UserDto from '../../dto/user.dto';

export interface UpdateUserApplication {
	setCurrentRefreshToken(
		refreshToken: string,
		userId: string
	): Promise<LeanDocument<UserDocument> | null>;

	setPassword(
		userEmail: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<UserDocument | null>;

	checkEmail(token: string): Promise<string>;

	updateSuperAdmin(user: UpdateUserDto, requestUser: UserDto): Promise<LeanDocument<UserDocument>>;
}
