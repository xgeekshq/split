import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TeamRoles } from 'libs/enum/team.roles';
import isEmpty from 'libs/utils/isEmpty';

import { CreateTeamDto } from '../dto/crate-team.dto';
import TeamUserDto from '../dto/team.user.dto';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class CreateTeamService implements CreateTeamServiceInterface {
	constructor(
		@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>
	) {}

	async createTeamUsers(teamUsers: TeamUserDto[], teamId: string) {
		await Promise.all(
			teamUsers.map((user) => this.teamUserModel.create({ ...user, team: teamId }))
		);
	}

	createTeamUser(teamUser: TeamUserDto) {
		return this.teamUserModel.create({ ...teamUser });
	}

	createTeam(name: string) {
		return this.teamModel.create({ name });
	}

	async create(teamData: CreateTeamDto, userId: string) {
		const { users, name } = teamData;
		const newTeam = await this.teamModel.create({
			name
		});

		const newUsers = [
			...users,
			{
				user: userId,
				role: TeamRoles.ADMIN,
				isNewbie: false
			}
		];

		if (!isEmpty(newUsers)) {
			await this.createTeamUsers(newUsers, newTeam._id);
		}

		return newTeam.populate('users');
	}
}
