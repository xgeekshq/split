import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CREATE_TEAM_USER_SERVICE, DELETE_TEAM_USER_SERVICE } from '../constants';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import UpdateTeamUserDto from '../dto/update.team.user.dto';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import TeamUserDto from '../dto/team.user.dto';

@Injectable()
export class AddAndRemoveTeamUsersUseCase implements UseCase<UpdateTeamUserDto, TeamUser[]> {
	constructor(
		@Inject(CREATE_TEAM_USER_SERVICE)
		private readonly createTeamUserService: CreateTeamUserServiceInterface,
		@Inject(DELETE_TEAM_USER_SERVICE)
		private readonly deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}

	async execute({ addUsers, removeUsers }: UpdateTeamUserDto): Promise<TeamUser[]> {
		try {
			const createdTeamUsers: TeamUser[] =
				(await this.addAndRemoveTeamUsersHandleAbortSession(addUsers, removeUsers)) ?? [];
			await this.createTeamUserService.commitTransaction();
			await this.deleteTeamUserService.commitTransaction();

			return createdTeamUsers;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			await this.createTeamUserService.abortTransaction();
			await this.deleteTeamUserService.abortTransaction();
			throw new BadRequestException(UPDATE_FAILED);
		}

		return createdTeamUsers;
	}
}
