import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TEAM_USER_REPOSITORY } from '../constants';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import TeamUser from '../entities/team.user.schema';

@Injectable()
export class CreateTeamUserUseCase implements UseCase<TeamUserDto, TeamUser> {
	constructor(
		@Inject(TEAM_USER_REPOSITORY)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async execute(teamUserData: TeamUserDto) {
		const teamUserSaved = await this.teamUserRepository.create({ ...teamUserData });

		if (!teamUserSaved) throw new BadRequestException(INSERT_FAILED);

		return teamUserSaved;
	}
}
