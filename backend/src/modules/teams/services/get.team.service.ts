import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class GetTeamService implements GetTeamServiceInterface {
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

  getTeam(teamId: string) {
    return this.teamModel.findById(teamId).lean().exec();
  }

  async getTeamsOfUser(userId: string) {
    const teams = await this.teamUserModel
      .find({ user: userId })
      .distinct('team');
    return this.teamModel
      .find({ _id: { $in: teams } })
      .select('_id name')
      .populate({ path: 'users', select: '_id user role' })
      .lean()
      .exec();
  }

  getTeamUser(userId: string, teamId: string) {
    return this.teamUserModel
      .findOne({ user: userId, team: teamId })
      .lean()
      .exec();
  }

  getAllTeams() {
    return this.teamModel
      .find()
      .populate({
        path: 'users',
        select: 'user role',
        populate: {
          path: 'user',
          select: '_id firstName lastName email joinedAt',
        },
      })
      .lean({ virtuals: true })
      .exec();
  }

  getUsersOfTeam(teamId: string) {
    return this.teamUserModel
      .find({ team: teamId })
      .populate({
        path: 'user',
        select: '_id firstName lastName email',
      })
      .lean()
      .exec();
  }
}
