import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';

import * as BoardTypes from 'modules/boards/interfaces/types';

import { TeamQueryParams } from '../../../libs/dto/param/team.query.params';
import { GetBoardServiceInterface } from '../../boards/interfaces/services/get.board.service.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class GetTeamService implements GetTeamServiceInterface {
	constructor(
		@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>,
		@Inject(forwardRef(() => BoardTypes.TYPES.services.GetBoardService))
		private getBoardService: GetBoardServiceInterface
	) {}

	async countTeams(userId: string) {
		return this.teamUserModel.find({ user: userId }).distinct('team').count();
	}

	countAllTeams() {
		return this.teamModel.countDocuments().exec();
	}

	getTeam(teamId: string, teamQueryParams: TeamQueryParams = {}) {
		const { loadUsers, teamUserRole } = teamQueryParams;
		const teamModel = this.teamModel.findById(teamId);
		let teamUserRoleFilter = {};

		if (teamUserRole) {
			teamUserRoleFilter = { match: { role: { $eq: teamUserRole } } };
		}

		if (loadUsers || teamUserRole) {
			teamModel
				.populate({
					path: 'users',
					select: 'user role',
					...teamUserRoleFilter,
					populate: {
						path: 'user',
						select: '_id firstName lastName email joinedAt'
					}
				})
				.lean({ virtuals: true });
		} else {
			teamModel.lean();
		}

		return teamModel.exec();
	}

	async getTeamsOfUser(userId: string): Promise<Team[]> {
		const teamsUser = await this.teamUserModel.find({ user: userId }).distinct('team');

		const teams: LeanDocument<TeamDocument>[] = await this.teamModel
			.find({ _id: { $in: teamsUser } })
			.select('_id name')
			.populate({
				path: 'users',
				select: 'user role',
				populate: {
					path: 'user',
					select: '_id firstName lastName email joinedAt'
				}
			})
			.populate({
				path: 'boards',
				select: '_id'
			})
			.lean()
			.exec();

		return teams.map((team) => {
			return { ...team, boardsCount: team.boards?.length ?? 0, boards: undefined };
		});
	}

	getTeamUser(userId: string, teamId: string) {
		return this.teamUserModel.findOne({ user: userId, team: teamId }).lean().exec();
	}

	getAllTeams() {
		return this.teamModel
			.find()
			.populate({
				path: 'users',
				select: 'user role',
				populate: {
					path: 'user',
					select: '_id firstName lastName email joinedAt'
				}
			})
			.lean({ virtuals: true })
			.exec();
	}

	getUsersOfTeam(teamId: string) {
		return this.teamUserModel
			.find({ team: teamId })
			.populate({
				path: 'user',
				select: '_id firstName lastName email isSAdmin'
			})
			.lean()
			.exec();
	}
}
