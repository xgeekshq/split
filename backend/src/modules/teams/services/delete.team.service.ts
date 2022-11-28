import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { DeleteTeamServiceInterface } from '../interfaces/services/delete.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class DeleteTeamService implements DeleteTeamServiceInterface {
	constructor(
		@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>
	) {}

	async delete(teamId: string): Promise<boolean> {
		const teamSession = await this.teamModel.db.startSession();
		teamSession.startTransaction();
		const teamUserSession = await this.teamModel.db.startSession();
		teamUserSession.startTransaction();

		try {
			await this.deleteTeam(teamId, teamSession);
			await this.deleteTeamUsers(teamId, teamUserSession);

			await teamSession.commitTransaction();
			await teamUserSession.commitTransaction();

			return true;
		} catch (e) {
			await teamSession.abortTransaction();
			await teamUserSession.abortTransaction();
		} finally {
			await teamSession.endSession();
			await teamUserSession.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteTeam(teamId: string, teamSession: ClientSession) {
		const result = await this.teamModel.findOneAndRemove(
			{
				_id: teamId
			},
			{ session: teamSession }
		);

		if (!result) throw new NotFoundException(DELETE_FAILED);
	}

	private async deleteTeamUsers(teamId: string, teamUserSession: ClientSession) {
		const { deletedCount } = await this.teamUserModel
			.deleteMany(
				{
					team: teamId
				},
				{ session: teamUserSession }
			)
			.exec();

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}
}
