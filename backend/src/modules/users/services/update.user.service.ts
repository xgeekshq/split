import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encrypt } from 'src/libs/utils/bcrypt';
import ResetPassword, {
	ResetPasswordDocument
} from 'src/modules/auth/schemas/reset-password.schema';
import UpdateUserDto from '../dto/update.user.dto';
import { UpdateUserService } from '../interfaces/services/update.user.service.interface';
import { TYPES } from '../interfaces/types';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import User, { UserDocument } from '../entities/user.schema';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import UserDto from '../dto/user.dto';

@Injectable()
export default class updateUserServiceImpl implements UpdateUserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@InjectModel(ResetPassword.name)
		private resetModel: Model<ResetPasswordDocument>
	) {}

	async setCurrentRefreshToken(refreshToken: string, userId: string) {
		const currentHashedRefreshToken = await encrypt(refreshToken);

		return this.userRepository.updateUserWithRefreshToken(
			currentHashedRefreshToken,
			String(userId)
		);
	}

	async setPassword(userEmail: string, newPassword: string, newPasswordConf: string) {
		const password = await encrypt(newPassword);

		if (newPassword !== newPasswordConf)
			throw new HttpException('PASSWORDS_DO_NOT_MATCH', HttpStatus.BAD_REQUEST);
		const user = this.userRepository.updateUserPassword(userEmail, password);

		if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

		return user;
	}

	async checkEmail(token: string) {
		const userFromDb = await this.resetModel.findOne({ token });

		if (!userFromDb) throw new HttpException('USER_FROM_TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND);
		this.tokenValidator(userFromDb.updatedAt);
		const user = await this.userRepository.findOneByField({ email: userFromDb.emailAddress });

		if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

		return user.email;
	}

	public tokenValidator(updatedAt: Date) {
		const isTokenValid = (new Date().getTime() - updatedAt.getTime()) / 1000 / 60 < 15;

		if (!isTokenValid) {
			throw new HttpException('EXPIRED_TOKEN', HttpStatus.BAD_REQUEST);
		}
	}

	async updateSuperAdmin(user: UpdateUserDto, requestUser: UserDto) {
		if (requestUser._id.toString() === user._id) {
			throw new BadRequestException(UPDATE_FAILED);
		}
		const userUpdated = await this.userRepository.updateSuperAdmin(user._id, user.isSAdmin);

		if (!userUpdated) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return userUpdated;
	}
}
