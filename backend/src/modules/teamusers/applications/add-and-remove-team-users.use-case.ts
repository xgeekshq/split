import TeamUserDto from 'src/modules/teamusers/dto/team.user.dto';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { AddAndRemoveTeamUsersUseCaseInterface } from '../interfaces/applications/add-and-remove-team-users.use-case.interface';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teams/entities/team.user.schema';
import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';

@Injectable()
export class AddAndRemoveTeamUsersUseCase implements AddAndRemoveTeamUsersUseCaseInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface,
		@Inject(TYPES.services.CreateTeamUserService)
		private createTeamUserService: CreateTeamUserServiceInterface,
		@Inject(TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}
	async execute(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]> {
		try {
			let createdTeamUsers: TeamUser[] = [];

			if (addUsers.length > 0)
				createdTeamUsers = await this.createTeamUserService.createTeamUsers(addUsers);

			if (removeUsers.length > 0)
				await this.deleteTeamUserService.deleteTeamUsers(removeUsers, false);

			return createdTeamUsers;
		} catch (error) {
			throw new BadRequestException(UPDATE_FAILED);
		}
	}
}
