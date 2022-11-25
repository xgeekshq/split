import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { DELETE_FAILED } from 'libs/exceptions/messages';

import { DeleteTeamServiceInterface } from '../interfaces/services/delete.team.service.interface';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class DeleteTeamService implements DeleteTeamServiceInterface {
	constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

	async delete(teamId: string): Promise<boolean> {
		const teamSession = await this.teamModel.db.startSession();
		teamSession.startTransaction();
		try {
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

	private async deleteTeam(teamId: string, teamSession: ClientSession) {
		const result = await this.teamModel.findOneAndRemove(
			{
				_id: teamId
			},
			{ session: teamSession }
		);

		if (!result) throw new NotFoundException(DELETE_FAILED);
		return { _id: result._id };
	}
}
