import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { UpdateTeamUserServiceInterface } from '../interfaces/services/update.team.user.service.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { TYPES } from '../interfaces/types';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';

@Injectable()
export default class UpdateTeamUserService implements UpdateTeamUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface,
		@Inject(TYPES.services.CreateTeamUserService)
		private createTeamUserService: CreateTeamUserServiceInterface,
		@Inject(TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}

	async updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser> {
		const teamUserSaved = await this.teamUserRepository.updateTeamUser(teamUserData);

		if (!teamUserSaved) throw new BadRequestException(UPDATE_FAILED);

		return teamUserSaved;
	}

	async addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]> {
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
