import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, LeanDocument, Model } from 'mongoose';
import TeamUserDto from '../dto/team.user.dto';
import { UpdateTeamServiceInterface } from '../interfaces/services/update.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';

@Injectable()
export default class UpdateTeamService implements UpdateTeamServiceInterface {
	constructor(@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>) {}

	updateTeamUser(teamData: TeamUserDto): Promise<LeanDocument<TeamUserDocument> | null> {
		return this.teamUserModel
			.findOneAndUpdate(
				{ user: teamData.user, team: teamData.team },
				{ $set: { role: teamData.role, isNewJoiner: teamData.isNewJoiner } },
				{ new: true }
			)
			.lean()
			.exec();
	}

	async addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]) {
		const teamUserSession = await this.teamUserModel.db.startSession();
		teamUserSession.startTransaction();
		try {
			let createdTeamUsers: TeamUserDocument[] = [];

			if (addUsers.length > 0) createdTeamUsers = await this.addTeamUsers(addUsers);

			if (removeUsers.length > 0) await this.deleteTeamUsers(removeUsers, teamUserSession);

			await teamUserSession.commitTransaction();

			return createdTeamUsers;
		} catch (error) {
			await teamUserSession.abortTransaction();
		} finally {
			await teamUserSession.endSession();
		}
		throw new BadRequestException(UPDATE_FAILED);
	}

	async addTeamUsers(teamUsers: TeamUserDto[]) {
		const createdTeamUsers = await this.teamUserModel.insertMany(teamUsers);

		if (createdTeamUsers.length < 1) throw new Error(INSERT_FAILED);

		return createdTeamUsers;
	}

	async deleteTeamUsers(teamUsers: string[], teamUserSession: ClientSession) {
		const { deletedCount } = await this.teamUserModel
			.deleteMany(
				{
					_id: teamUsers
				},
				{ session: teamUserSession }
			)
			.exec();

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}
}
