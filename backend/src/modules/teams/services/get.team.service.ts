import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { TeamQueryParams } from '../../../libs/dto/param/team.query.params';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import { UserWithTeams } from '../../users/interfaces/type-user-with-teams';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class GetTeamService implements GetTeamServiceInterface {
	constructor(
		@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>
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
					select: 'user role isNewJoiner',
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

		return teamModel
			.select('_id name')
			.populate({
				path: 'users',
				select: 'user role isNewJoiner',
				populate: {
					path: 'user',
					select: '_id firstName lastName email joinedAt'
				}
			})
			.lean()
			.exec();
	}

	async getTeamsOfUser(userId: string) {
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

	async getUsersOnlyWithTeams() {
		const teams: LeanDocument<UserWithTeams>[] = await this.teamUserModel.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$lookup: {
					from: 'teams',
					localField: 'team',
					foreignField: '_id',
					as: 'teams'
				}
			},
			{
				$unwind: { path: '$user' }
			},
			{
				$unwind: { path: '$teams' }
			},

			{
				$group: {
					_id: '$user',
					teamsName: { $push: '$teams.name' }
				}
			},
			{
				$set: { userWithTeam: '$_id' }
			},
			{
				$unset: [
					'_id',
					'userWithTeam.currentHashedRefreshToken',
					'userWithTeam.joinedAt',
					'userWithTeam.isDeleted'
				]
			},
			{
				$project: {
					user: '$userWithTeam',
					teamsNames: '$teamsName'
				}
			}
		]);

		return teams;
	}

	getTeamUser(userId: string, teamId: string) {
		return this.teamUserModel.findOne({ user: userId, team: teamId }).lean().exec();
	}

	getAllTeams() {
		return this.teamModel
			.find()
			.populate({
				path: 'users',
				select: 'user role email',
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
