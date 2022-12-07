import { Inject, Injectable } from '@nestjs/common';
import isEmpty from 'src/libs/utils/isEmpty';
import { CreateTeamDto } from '../dto/crate-team.dto';
import TeamUserDto from '../dto/team.user.dto';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import TeamUser from '../entities/team.user.schema';
import { TeamRepositoryInterface } from '../repositories/team.repository.interface';
import { TeamUserRepositoryInterface } from '../repositories/team-user.repository.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export default class CreateTeamService implements CreateTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamRepository)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async createTeamUsers(teamUsers: TeamUserDto[], teamId: string) {
		return Promise.all(
			teamUsers.map((user) => this.teamUserRepository.create({ ...user, team: teamId }))
		);
	}

	createTeamUser(teamUser: TeamUserDto) {
		return this.teamUserRepository.create({ ...teamUser });
	}

	createTeam(name: string) {
		return this.teamRepository.create({ name });
	}

	async create(teamData: CreateTeamDto) {
		const { users, name } = teamData;
		const newTeam = await this.teamRepository.create({
			name
		});

		let teamUsers: TeamUser[] = [];

		if (!isEmpty(users)) {
			teamUsers = await this.createTeamUsers(users, newTeam._id);
		}

		return { ...newTeam, users: teamUsers };
	}
}
