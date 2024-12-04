import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Team from '../entities/team.schema';
import { GET_TEAM_SERVICE } from '../constants';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';

@Injectable()
export class GetTeamByNameUseCase implements UseCase<string, Team> {
	constructor(
		@Inject(GET_TEAM_SERVICE)
		private readonly getTeamService: GetTeamServiceInterface
	) {}

	execute(teamName: string) {
		return this.getTeamService.getTeamByName(teamName);
	}
}
