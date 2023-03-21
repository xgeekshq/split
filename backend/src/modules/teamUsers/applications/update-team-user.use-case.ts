import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@Injectable()
export class UpdateTeamUserUseCase implements UseCase<TeamUserDto, TeamUser> {
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
