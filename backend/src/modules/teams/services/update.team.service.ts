import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
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

	async addAndRemoveTeamUsers(addUsers: TeamUserDto[], removeUsers: string[]) {
		try {
			let createdTeamUsers: TeamUser[] = [];

			if (addUsers.length > 0) createdTeamUsers = await this.addTeamUsers(addUsers);

			if (removeUsers.length > 0) await this.deleteTeamUsers(removeUsers, false);

			return createdTeamUsers;
		} catch (error) {
			throw new BadRequestException(UPDATE_FAILED);
		}
	}

	async addTeamUsers(teamUsers: TeamUserDto[]) {
		const createdTeamUsers = await this.teamUserRepository.insertMany(teamUsers);

		if (createdTeamUsers.length < 1) throw new Error(INSERT_FAILED);

		return createdTeamUsers;
	}

	async deleteTeamUsers(teamUsers: string[], withSession: boolean) {
		const deletedCount = await this.teamUserRepository.deleteMany(
			{
				_id: { $in: teamUsers }
			},
			withSession
		);

		if (deletedCount <= 0) throw new Error(DELETE_FAILED);
	}
}
