import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import TeamUser, { TeamUserDocument } from 'src/modules/teams/schemas/team.user.schema';
import User, { UserDocument } from '../entities/user.schema';
import { DeleteUserServiceInterface } from '../interfaces/services/delete.user.service.interface';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export default class DeleteUserServiceImpl implements DeleteUserServiceInterface {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>
	) {}

	async delete(userId: string): Promise<boolean> {
		const userSession = await this.userModel.db.startSession();
		userSession.startTransaction();
		const teamUserSession = await this.teamUserModel.db.startSession();
		teamUserSession.startTransaction();
		try {
			await this.deleteUser(userId, userSession);
			const deletedTeamUser = await this.deleteTeamUsers(userId, teamUserSession);

			if (deletedTeamUser) {
				await teamUserSession.commitTransaction();
			}
			await userSession.commitTransaction();

			return true;
		} catch (e) {
			await userSession.abortTransaction();
			await teamUserSession.abortTransaction();
		} finally {
			await userSession.endSession();
			await teamUserSession.endSession();
		}
		throw new BadRequestException(DELETE_FAILED);
	}

	private async deleteUser(userId: string, userSession: ClientSession) {
		const result = await this.userModel.findOneAndRemove(
			{
				_id: userId
			},
			{ session: userSession }
		);

		if (!result) throw new NotFoundException(DELETE_FAILED);
	}

	private async deleteTeamUsers(userId: string, teamUserSession: ClientSession) {
		const { deletedCount } = await this.teamUserModel
			.deleteMany(
				{
					user: userId
				},
				{ session: teamUserSession }
			)
			.exec();

		if (deletedCount == 0) {
			return false;
		}

		if (deletedCount < 0) {
			throw new Error(DELETE_FAILED);
		}

		return true;
	}
}
