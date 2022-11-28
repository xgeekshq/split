import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'src/libs/utils/bcrypt';
import { GetTeamServiceInterface } from 'src/modules/teams/interfaces/services/get.team.service.interface';
import { TYPES } from 'src/modules/teams/interfaces/types';
import UserDto from '../dto/user.dto';
import { GetUserService } from '../interfaces/services/get.user.service.interface';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class GetUserServiceImpl implements GetUserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@Inject(TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface
	) {}

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

	async getAllUsersWithTeams() {
		const users = await this.getAllUsers();
		const mappedUsers: UserWithTeams[] = users.map((userFound) => {
			return {
				user: userFound as UserDto,
				teams: []
			};
		});
		const usersOnlyWithTeams = await this.getTeamService.getUsersOnlyWithTeams();
		const ids = new Set(usersOnlyWithTeams.map((userWithTeams) => String(userWithTeams.user._id)));

		return [
			...usersOnlyWithTeams,
			...mappedUsers.filter((user) => !ids.has(String(user.user._id)))
		];
	}
}
