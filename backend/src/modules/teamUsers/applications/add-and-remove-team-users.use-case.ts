import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { DeleteTeamUserServiceInterface } from '../interfaces/services/delete.team.user.service.interface';
import UpdateTeamUserDto from '../dto/update.team.user.dto';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@Injectable()
export class AddAndRemoveTeamUsersUseCase
	implements UseCase<UpdateTeamUserDto, TeamUser[]>
{
	constructor(
		@Inject(TYPES.services.CreateTeamUserService)
		private createTeamUserService: CreateTeamUserServiceInterface,
		@Inject(TYPES.services.DeleteTeamUserService)
		private deleteTeamUserService: DeleteTeamUserServiceInterface
	) {}
	async execute({ addUsers, removeUsers }: UpdateTeamUserDto): Promise<TeamUser[]> {
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
