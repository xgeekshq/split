import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { TeamUserUseCaseInterface } from '../interfaces/applications/team-user.use-case.interface';
import TeamUser from '../entities/team.user.schema';

@Injectable()
export class CreateTeamUserUseCase implements TeamUserUseCaseInterface<TeamUserDto, TeamUser> {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async execute(teamUserData: TeamUserDto) {
		const teamUserSaved = await this.teamUserRepository.create({ ...teamUserData });

		if (!teamUserSaved) throw new BadRequestException(INSERT_FAILED);

		return teamUserSaved;
	}
}
