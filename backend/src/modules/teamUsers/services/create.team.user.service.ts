import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { TYPES } from '../interfaces/types';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import TeamUserDto from '../dto/team.user.dto';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from '../entities/team.user.schema';

@Injectable()
export default class CreateTeamUserService implements CreateTeamUserServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamUserRepository)
		private readonly teamUserRepository: TeamUserRepositoryInterface
	) {}

	async createTeamUsers(
		teamUsers: TeamUserDto[],
		teamId?: string,
		withSession?: boolean
	): Promise<TeamUser[]> {
		const teamUsersToSave = teamId
			? teamUsers.map((teamUser) => ({ ...teamUser, team: teamId }))
			: teamUsers;

		const teamUsersSaved = await this.teamUserRepository.insertMany(teamUsersToSave, withSession);

		if (teamUsersSaved.length < teamUsers.length) throw new BadRequestException(INSERT_FAILED);

		return teamUsersSaved;
	}

	async createTeamUser(teamUser: TeamUserDto): Promise<TeamUser> {
		const teamUserSaved = await this.teamUserRepository.create({ ...teamUser });

		if (!teamUserSaved) throw new BadRequestException(INSERT_FAILED);

		return teamUserSaved;
	}

	// these functions are not tested since they make direct queries to the database
	startTransaction(): Promise<void> {
		return this.teamUserRepository.startTransaction();
	}

	commitTransaction(): Promise<void> {
		return this.teamUserRepository.commitTransaction();
	}

	abortTransaction(): Promise<void> {
		return this.teamUserRepository.abortTransaction();
	}

	endSession(): Promise<void> {
		return this.teamUserRepository.endSession();
	}
}
