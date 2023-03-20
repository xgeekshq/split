import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import isEmpty from 'src/libs/utils/isEmpty';
import { CreateTeamDto } from '../dto/crate-team.dto';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import TeamUser from '../entities/team.user.schema';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TYPES } from '../interfaces/types';
import { TEAM_ALREADY_EXISTS } from 'src/libs/constants/team';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';

@Injectable()
export default class CreateTeamService implements CreateTeamServiceInterface {
	constructor(
		@Inject(TYPES.repositories.TeamRepository)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(TeamUsers.TYPES.services.CreateTeamUserService)
		private readonly createTeamUserService: CreateTeamUserServiceInterface
	) {}

	createTeam(name: string) {
		return this.teamRepository.create({ name });
	}

	async create(teamData: CreateTeamDto) {
		const { users, name } = teamData;

		const isTeamAlreadyCreated = await this.teamRepository.findOneByField({ name });

		if (isTeamAlreadyCreated) {
			throw new HttpException(TEAM_ALREADY_EXISTS, HttpStatus.CONFLICT);
		}

		await this.teamRepository.startTransaction();
		await this.createTeamUserService.startTransaction();

		try {
			const newTeam = await this.teamRepository.create({
				name
			});

			let teamUsers: TeamUser[] = [];

			if (!isEmpty(users)) {
				teamUsers = await this.createTeamUserService.createTeamUsers(users, newTeam._id);
			}

			await this.teamRepository.commitTransaction();
			await this.createTeamUserService.commitTransaction();

			return { ...newTeam, users: teamUsers };
		} catch (error) {
			await this.teamRepository.abortTransaction();
			await this.createTeamUserService.abortTransaction();
		} finally {
			await this.teamRepository.endSession();
			await this.createTeamUserService.endSession();
		}
		throw new BadRequestException(INSERT_FAILED);
	}
}
