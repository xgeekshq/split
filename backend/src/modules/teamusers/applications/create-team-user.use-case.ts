import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { CreateTeamUserUseCaseInterface } from '../interfaces/applications/create-team-user.use-case.interface';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export class CreateTeamUserUseCase implements CreateTeamUserUseCaseInterface {
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
