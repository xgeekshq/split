import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';
import { TeamUserUseCaseInterface } from '../interfaces/applications/team-user.use-case.interface';
import TeamUser from '../entities/team.user.schema';

@Injectable()
export class DeleteTeamUserUseCase implements TeamUserUseCaseInterface<string, TeamUser> {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async execute(teamUserId: string) {
		const deletedTeamUser = await this.teamUserRepository.deleteTeamUser(teamUserId, false);

		if (!deletedTeamUser) throw new BadRequestException(DELETE_FAILED);

		return deletedTeamUser;
	}
}
