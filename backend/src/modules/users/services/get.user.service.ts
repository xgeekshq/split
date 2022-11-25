import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'src/libs/utils/bcrypt';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class GetUserServiceImpl implements GetUserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	getByEmail(email: string) {
		return this.userModel.findOne({ email }).lean().exec();
	}

	getById(_id: string) {
		return this.userModel
			.findById(_id)
			.select(['-password -currentHashedRefreshToken'])
			.lean()
			.exec();
	}

	async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
		const user = await this.getById(userId);

		if (!user || !user.currentHashedRefreshToken) return false;

		const isRefreshTokenMatching = await compare(refreshToken, user.currentHashedRefreshToken);

		return isRefreshTokenMatching ? user : false;
	}

	countUsers() {
		return this.userModel.countDocuments().exec();
	}

	getAllUsers() {
		return this.userModel.find().select('-password -currentHashedRefreshToken').lean().exec();
	}
}
