import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Team from '../entities/team.schema';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from '../constants';

@Injectable()
export class GetAllTeamsUseCase implements UseCase<void, Team[]> {
	constructor(
		@Inject(TEAM_REPOSITORY)
		private readonly teamRepository: TeamRepositoryInterface
	) {}

	async execute() {
		return this.teamRepository.getAllTeams();
	}
}
