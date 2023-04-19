import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { Inject, Injectable } from '@nestjs/common';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { CREATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

@Injectable()
export class CreateTeamUsersUseCase implements UseCase<TeamUserDto[], TeamUser[]> {
	constructor(
		@Inject(CREATE_TEAM_USER_SERVICE)
		private readonly createTeamUserService: CreateTeamUserServiceInterface
	) {}

	execute(teamUsers: TeamUserDto[]): Promise<TeamUser[]> {
		return this.createTeamUserService.createTeamUsers(teamUsers);
	}
}
