import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamRoles } from '../../../libs/enum/team.roles';
import isEmpty from '../../../libs/utils/isEmpty';
import TeamDto from '../dto/team.dto';
import TeamUserDto from '../dto/team.user.dto';
import { CreateTeamService } from '../interfaces/services/create.team.service.interface';
import TeamUser, { TeamUserDocument } from '../schemas/team.user.schema';
import Team, { TeamDocument } from '../schemas/teams.schema';

@Injectable()
export default class CreateTeamServiceImpl implements CreateTeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>,
  ) {}

  addTeamAdmin(users: TeamUserDto[], userId: string) {
    return [
      ...users,
      {
        user: userId,
        role: TeamRoles.ADMIN,
      },
    ];
  }

  createTeamUsers(teamUsers: TeamUserDto[], teamId: string) {
    Promise.all(
      teamUsers.map((user) =>
        this.teamUserModel.create({ ...user, team: teamId }),
      ),
    );
  }

  async create(teamData: TeamDto, userId: string) {
    const { users } = teamData;
    const newTeam = await this.teamModel.create({
      name: teamData.name,
    });

    const newUsers = this.addTeamAdmin(users, userId);

    if (!isEmpty(newUsers)) {
      this.createTeamUsers(newUsers, newTeam._id);
    }

    return newTeam;
  }
}
