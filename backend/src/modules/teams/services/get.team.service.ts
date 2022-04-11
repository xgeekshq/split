import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetTeamService } from '../interfaces/services/get.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class GetTeamServiceImpl implements GetTeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>,
  ) {}

  countTeams(userId: string) {
    return this.teamModel
      .countDocuments({
        users: { $elemMatch: { user: userId } },
      })
      .exec();
  }

  getTeamsOfUser(userId: string) {
    return this.teamUserModel
      .find({ user: userId })
      .distinct('team')
      .lean()
      .exec();
  }

  getTeamUser(userId: string, teamId: string) {
    return this.teamUserModel
      .findOne({ user: userId, team: teamId })
      .lean()
      .exec();
  }
}
