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

	// this function won't be tested since it is a direct query to the database
	updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser> {
		return this.teamUserRepository.updateTeamUser(teamUserData);
	}

	async addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]> {
		try {
			const createdTeamUsers: TeamUser[] =
				(await this.addAndRemoveTeamUsersHandleAbortSession(addUsers, removeUsers)) ?? [];
			await this.createTeamUserService.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();

			return createdTeamUsers;
		} catch (error) {
			throw new BadRequestException(UPDATE_FAILED);
		}
	}

	/* --------------- HELPERS --------------- */

	private async addAndRemoveTeamUsersHandleAbortSession(
		addUsers: TeamUserDto[],
		removeUsers: string[]
	) {
		let createdTeamUsers: TeamUser[];
		try {
			await this.createTeamUserService.startTransaction();
			await this.deleteTeamUserService.startTransaction();

			if (addUsers.length > 0)
				createdTeamUsers = await this.createTeamUserService.createTeamUsers(addUsers, null, true);

			if (removeUsers.length > 0)
				await this.deleteTeamUserService.deleteTeamUsers(removeUsers, true);
		} catch (error) {
			await this.createTeamUserService.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
			throw new BadRequestException(UPDATE_FAILED);
		}

		return createdTeamUsers;
	}
}
