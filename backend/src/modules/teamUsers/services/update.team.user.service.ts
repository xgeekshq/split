import { UpdateTeamUserServiceInterface } from '../interfaces/services/update.team.user.service.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { TEAM_USER_REPOSITORY } from '../constants';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export default class UpdateTeamUserService implements UpdateTeamUserServiceInterface {
	constructor(
		@Inject(TEAM_USER_REPOSITORY)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async updateTeamUser(teamUserData: TeamUserDto): Promise<TeamUser> {
		const teamUserSaved = await this.teamUserRepository.updateTeamUser(teamUserData);

		if (!teamUserSaved) throw new BadRequestException(UPDATE_FAILED);

		return teamUserSaved;
	}
}
