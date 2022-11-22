import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';

import TeamUserDto from '../dto/team.user.dto';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import { UpdateTeamServiceInterface } from '../interfaces/services/update.team.service.interface';
import { TYPES } from '../interfaces/types';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class UpdateTeamService implements UpdateTeamServiceInterface {
	constructor(
		@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>,
		@Inject(TYPES.services.GetTeamService)
		private getTeamService: GetTeamServiceInterface
	) {}

	async updateTeamUser(
		userId: string,
		teamId: string,
		teamData: TeamUserDto
	): Promise<LeanDocument<TeamUserDocument> | null> {
		const team = await this.teamModel.findById(teamId).exec();

		const teamUser = await this.getTeamService.getTeamUser(teamData.user, teamId);

		if (!team) {
			throw new NotFoundException('Team not found!');
		}

		if (!teamUser) {
			throw new NotFoundException('Team member not found!');
		}

		return this.teamUserModel
			.findOneAndUpdate(
				{ user: teamData.user, team: teamId },
				{ $set: { role: teamData.role, isNewJoiner: teamData.isNewJoiner } },
				{ new: true }
			)
			.lean()
			.exec();
	}
}
