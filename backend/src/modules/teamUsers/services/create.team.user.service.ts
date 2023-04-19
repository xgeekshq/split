import { CreateTeamUserServiceInterface } from '../interfaces/services/create.team.user.service.interface';
import { TEAM_USER_REPOSITORY } from '../constants';
import { TeamUserRepositoryInterface } from '../interfaces/repositories/team-user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import TeamUserDto from '../dto/team.user.dto';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import TeamUser from '../entities/team.user.schema';

@Injectable()
export default class CreateTeamUserService implements CreateTeamUserServiceInterface {
	constructor(
		@Inject(TEAM_USER_REPOSITORY)
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
		const areAllTeamUsersSaved = teamUsersSaved.length === teamUsersToSave.length;

		if (!areAllTeamUsersSaved) throw new BadRequestException(INSERT_FAILED);

		return teamUsersSaved;
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
