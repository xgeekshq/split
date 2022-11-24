import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, LeanDocument, Model } from 'mongoose';

import { DELETE_FAILED } from 'libs/exceptions/messages';

import { DeleteTeamServiceInterface } from '../interfaces/services/delete.team.service.interface';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import * as Teams from '../interfaces/types';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class DeleteTeamService implements DeleteTeamServiceInterface {
	constructor(
		@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
		@Inject(forwardRef(() => Teams.TYPES.services.GetTeamService))
		private getTeamService: GetTeamServiceInterface
	) {}

	async delete(teamId: string): Promise<boolean> {
		const team = await this.getTeam(teamId);
		// no need ?
		if (!team) {
			throw new NotFoundException('Team not found!');
		}

		const teamSession = await this.teamModel.db.startSession();
		teamSession.startTransaction();
		try {
			// delete team
			await this.deleteTeam(teamId, teamSession);
			await teamSession.commitTransaction();
			return true;
		} catch (e) {
			await teamSession.abortTransaction();
		} finally {
			await teamSession.endSession();
		}

		return false;
	}

	/* ----- HELPERS ------ */
	private async getTeam(teamId: string): Promise<LeanDocument<TeamDocument>> {
		const team = await this.getTeamService.getTeam(teamId);
		if (!team) {
			throw new NotFoundException('Team not found!');
		}
		return team;
	}

	// private async getUser(userId: string): Promise<LeanDocument<UserDocument>> {
	// 	const user = await this.getUserService.getById(userId);
	// 	if (!user) {
	// 		throw new NotFoundException('User not found!');
	// 	}
	// 	return user;
	// }

	// private async getTeamUser(
	// 	userId: string,
	// 	teamId: string
	// ): Promise<LeanDocument<TeamUserDocument>> {
	// 	const teamUser = await this.getTeamService.getTeamUser(userId, teamId);
	// 	if (!teamUser) {
	// 		throw new NotFoundException('User does not belong to team!');
	// 	}
	// 	return teamUser;
	// }

	private async deleteTeam(teamId: string, teamSession: ClientSession) {
		const result = await this.teamModel.findOneAndRemove(
			{
				_id: teamId
			},
			{ session: teamSession }
		);

		if (!result) throw Error(DELETE_FAILED);
		return { _id: result._id };
	}
}
