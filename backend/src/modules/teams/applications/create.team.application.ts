import { Inject, Injectable } from '@nestjs/common';
import TeamDto from '../dto/team.dto';
import { CreateTeamApplication } from '../interfaces/applications/create.team.application.interface';
import { CreateTeamService } from '../interfaces/services/create.team.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateTeamApplicationImpl implements CreateTeamApplication {
  constructor(
    @Inject(TYPES.services.CreateTeamService)
    private createTeamService: CreateTeamService,
  ) {}

  create(teamData: TeamDto, userId: string) {
    return this.createTeamService.create(teamData, userId);
  }
}
