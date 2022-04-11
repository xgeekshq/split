import { Inject, Injectable } from '@nestjs/common';
import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { GetTeamService } from '../interfaces/services/get.team.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetTeamApplicationImpl implements GetTeamApplicationInterface {
  constructor(
    @Inject(TYPES.services.GetTeamService)
    private getTeamService: GetTeamService,
  ) {}

  countTeams(userId: string) {
    return this.getTeamService.countTeams(userId);
  }
}
