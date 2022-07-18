import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TeamRoles } from 'libs/enum/team.roles';
import { CreateTeamServiceInterface } from 'modules/teams/interfaces/services/create.team.service.interface';
import { GetTeamServiceInterface } from 'modules/teams/interfaces/services/get.team.service.interface';
import * as TeamTypes from 'modules/teams/interfaces/types';

import CreateUserDto from '../dto/create.user.dto';
import { CreateUserService } from '../interfaces/services/create.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class CreateUserServiceImpl implements CreateUserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@Inject(TeamTypes.TYPES.services.CreateTeamService)
		private createTeamService: CreateTeamServiceInterface,
		@Inject(TeamTypes.TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface
	) {}

	async create(userData: CreateUserDto) {
		const teams = await this.getTeamService.getAllTeams();
		let team = teams.length === 0 ? null : teams[0];
		if (!team) {
			const createdTeam = await this.createTeamService.createTeam('xgeeks');
			team = createdTeam;
		}
		const user = await this.userModel.create(userData);
		if (team) {
			await this.createTeamService.createTeamUser({
				user: user._id,
				team: team._id,
				role: TeamRoles.MEMBER
			});
		}
		return user;
	}
}
