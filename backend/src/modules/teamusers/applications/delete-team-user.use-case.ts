import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { DeleteTeamUserUseCaseInterface } from '../interfaces/applications/delete-team-user.use-case.interface';
import { DELETE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export class DeleteTeamUserUseCase implements DeleteTeamUserUseCaseInterface {
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
