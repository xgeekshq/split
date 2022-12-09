import { LeanDocument } from 'mongoose';
import UpdateUserDto from '../../dto/update.user.dto';
import User, { UserDocument } from '../../entities/user.schema';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';

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

	updateSuperAdmin(
		user: UpdateUserDto,
		requestUser: RequestWithUser
	): Promise<LeanDocument<UserDocument>>;
}
