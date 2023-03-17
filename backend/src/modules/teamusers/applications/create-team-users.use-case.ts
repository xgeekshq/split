import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { CreateTeamUsersUseCaseInterface } from '../interfaces/applications/create-team-users.use-case.interface';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teams/entities/team.user.schema';

@Injectable()
export class CreateTeamUsersUseCase implements CreateTeamUsersUseCaseInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async execute(teamUsers: TeamUserDto[]): Promise<TeamUser[]> {
		const teamUsersSaved = await this.teamUserRepository.insertMany(teamUsers);

		if (teamUsersSaved.length < 1) throw new BadRequestException(INSERT_FAILED);

		return teamUsersSaved;
	}
}
