import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { INSERT_FAILED } from '../../../libs/exceptions/messages';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import TeamDto from '../dto/team.dto';
import { CreateTeamApplication } from '../interfaces/applications/create.team.application.interface';
import { TYPES } from '../interfaces/types';

@Controller('teams')
export default class TeamsController {
  constructor(
    @Inject(TYPES.applications.CreateTeamApplication)
    private createTeamApp: CreateTeamApplication,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() teamData: TeamDto) {
    const { _id: userId } = request.user;
    const team = await this.createTeamApp.create(teamData, userId);
    if (!team) throw new BadRequestException(INSERT_FAILED);
    return team;
  }
}
