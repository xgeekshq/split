import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Team from '../entities/team.schema';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from '../constants';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';

@Injectable()
export class GetTeamsUserIsNotMemberUseCase implements UseCase<string, Team[]> {
	constructor(
		@Inject(TEAM_REPOSITORY)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(TeamUsers.TYPES.services.GetTeamUserService)
		private readonly getTeamUserService: GetTeamUserServiceInterface
	) {}

	async execute(userId: string) {
		const allTeams = await this.teamRepository.getAllTeams();
		const teamUsers = await this.getTeamUserService.getAllTeamsOfUser(userId);

		//ID's of the teams the user IS member
		const teamsIds = teamUsers.map((team) => team.toString());

		// extract all the teams where user is not a member
		const teamsUserIsNotMember = allTeams.flatMap((team) => {
			if (teamsIds.includes(team._id.toString())) return [];

			const { name, _id } = team;

			return { name, _id };
		});

		return teamsUserIsNotMember;
	}
}
