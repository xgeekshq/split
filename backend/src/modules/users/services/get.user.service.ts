import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'libs/utils/bcrypt';
import { GetTeamServiceInterface } from 'modules/teams/interfaces/services/get.team.service.interface';
import { TYPES } from 'modules/teams/interfaces/types';
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
		const results: UserWithTeams[] = [];

		const usersOnlyWithTeams = await this.getTeamService.getUsersOnlyWithTeams();

		users.forEach((user) => {
			let userHasTeam = false;
			const teams: string[] = [];
			usersOnlyWithTeams.forEach((userOnlyWithTeams) => {
				if (user._id.toString() === userOnlyWithTeams._id.toString()) {
					userHasTeam = true;

					const { teamsNames } = userOnlyWithTeams;

					teamsNames.forEach((element) => {
						element.forEach((el) => {
							teams.push(el);
						});
					});
				}
			});

			if (userHasTeam) {
				const userWithTeams: UserWithTeams = {
					user,
					teams
				};
				results.push(userWithTeams);
			} else {
				const userWithTeams: UserWithTeams = {
					user
				};
				results.push(userWithTeams);
			}
		});

		return results;
	}
}
