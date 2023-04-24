import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Team from '../entities/team.schema';
import { GET_TEAM_SERVICE } from '../constants';
import { GetTeamServiceInterface } from '../interfaces/services/get.team.service.interface';
import { GetTeamUseCaseDto } from '../dto/use-cases/get-team.use-case.dto';

@Injectable()
export class GetTeamUseCase implements UseCase<GetTeamUseCaseDto, Team> {
	constructor(
		@Inject(GET_TEAM_SERVICE)
		private readonly getTeamService: GetTeamServiceInterface
	) {}

	execute({ teamId, teamQueryParams }: GetTeamUseCaseDto) {
		return this.getTeamService.getTeam(teamId, teamQueryParams);
	}
}
