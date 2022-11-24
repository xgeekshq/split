import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';

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
}
