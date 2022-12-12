import { Inject, Injectable } from '@nestjs/common';
import TeamUserDto from '../dto/team.user.dto';
import TeamUser from '../entities/team.user.schema';
import { UpdateTeamServiceInterface } from '../interfaces/services/update.team.service.interface';
import { TYPES } from '../interfaces/types';
import { TeamUserRepositoryInterface } from '../repositories/team-user.repository.interface';

@Injectable()
export default class UpdateTeamService implements UpdateTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	updateTeamUser(teamData: TeamUserDto): Promise<TeamUser | null> {
		return this.teamUserRepository.updateTeamUser(teamData);
	}
}
