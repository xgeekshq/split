import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UpdateTeamUserUseCaseInterface } from '../interfaces/applications/update-team-user.use-case.interface';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teams/entities/team.user.schema';

@Injectable()
export class UpdateTeamUserUseCase implements UpdateTeamUserUseCaseInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async execute(teamUserData: TeamUserDto): Promise<TeamUser> {
		const teamUserSaved = await this.teamUserRepository.updateTeamUser(teamUserData);

		if (!teamUserSaved) throw new BadRequestException(UPDATE_FAILED);

		return teamUserSaved;
	}
}
