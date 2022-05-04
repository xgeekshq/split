import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { INSERT_FAILED } from '../../../libs/exceptions/messages';
import JwtAuthenticationGuard from '../../../libs/guards/jwtAuth.guard';
import RequestWithUser from '../../../libs/interfaces/requestWithUser.interface';
import TeamDto from '../dto/team.dto';
import TeamUserDto from '../dto/team.user.dto';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { TYPES } from '../interfaces/types';

@Controller('teams')
export default class TeamsController {
  constructor(
    @Inject(TYPES.applications.CreateTeamApplication)
    private createTeamApp: CreateTeamApplicationInterface,
    @Inject(TYPES.applications.GetTeamApplication)
    private getTeamApp: GetTeamApplicationInterface,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() teamData: TeamDto) {
    const team = await this.createTeamApp.create(teamData, request.user._id);
    if (!team) throw new BadRequestException(INSERT_FAILED);
    return team;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createTeamUser(@Body() teamData: TeamUserDto) {
    const team = await this.createTeamApp.createTeamUser(teamData);
    if (!team) throw new BadRequestException(INSERT_FAILED);
    return team;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getAllTeams() {
    return this.getTeamApp.getAllTeams();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/member')
  getTeamsOfUser(@Req() request: RequestWithUser) {
    return this.getTeamApp.getTeamsOfUser(request.user._id);
  }
}
