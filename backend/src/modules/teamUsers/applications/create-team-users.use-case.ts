import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@Injectable()
export class CreateTeamUsersUseCase implements UseCase<TeamUserDto[], TeamUser[]> {
	constructor(
		@Inject(TYPES.services.CreateTeamUserService)
		private createTeamUserService: CreateTeamUserServiceInterface
	) {}

	async execute(teamUsers: TeamUserDto[]): Promise<TeamUser[]> {
		return this.createTeamUserService.createTeamUsers(teamUsers);
	}
}
