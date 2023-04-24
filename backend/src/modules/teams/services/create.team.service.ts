import TeamUserDto from 'src/modules/teamUsers/dto/team.user.dto';
import { INSERT_FAILED } from 'src/libs/exceptions/messages';
import { CreateTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/create.team.user.service.interface';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import isEmpty from 'src/libs/utils/isEmpty';
import { CreateTeamDto } from '../dto/create-team.dto';
import { CreateTeamServiceInterface } from '../interfaces/services/create.team.service.interface';
import { TeamRepositoryInterface } from '../interfaces/repositories/team.repository.interface';
import { TEAM_REPOSITORY } from '../constants';
import { TEAM_ALREADY_EXISTS } from 'src/libs/constants/team';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import { CREATE_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

@Injectable()
export default class CreateTeamService implements CreateTeamServiceInterface {
	constructor(
		@Inject(TEAM_REPOSITORY)
		private readonly teamRepository: TeamRepositoryInterface,
		@Inject(CREATE_TEAM_USER_SERVICE)
		private readonly createTeamUserService: CreateTeamUserServiceInterface
	) {}

	async create(teamData: CreateTeamDto) {
		const { users, name } = teamData;

		const isTeamAlreadyCreated = await this.teamRepository.findOneByField({ name });

		if (isTeamAlreadyCreated) {
			throw new HttpException(TEAM_ALREADY_EXISTS, HttpStatus.CONFLICT);
		}

		await this.teamRepository.startTransaction();
		await this.createTeamUserService.startTransaction();

		try {
			const teamCreated = await this.createTeamAndTeamUsers(name, users);

			await this.teamRepository.commitTransaction();
			await this.createTeamUserService.commitTransaction();

			return teamCreated;
		} catch (error) {
			throw new BadRequestException(INSERT_FAILED);
		} finally {
			await this.teamRepository.endSession();
			await this.createTeamUserService.endSession();
		}
	}

	private async createTeamAndTeamUsers(teamName: string, users: TeamUserDto[]) {
		try {
			const newTeam = await this.teamRepository.create({
				name: teamName
			});

			if (!newTeam) throw new BadRequestException(INSERT_FAILED);

			let teamUsers: TeamUser[] = [];

			if (!isEmpty(users)) {
				teamUsers = await this.createTeamUserService.createTeamUsers(users, newTeam._id);

				if (teamUsers.length !== users.length) throw new BadRequestException(INSERT_FAILED);
			}

			return { ...newTeam, users: teamUsers };
		} catch (error) {
			await this.teamRepository.abortTransaction();
			await this.createTeamUserService.abortTransaction();
		}
	}
}
