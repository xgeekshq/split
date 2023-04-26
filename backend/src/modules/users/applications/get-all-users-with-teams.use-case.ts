import { GetAllUsersWithTeamsPresenter } from '../presenter/get-all-users-with-teams.presenter';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserWithTeams } from '../interfaces/type-user-with-teams';
import { TYPES } from '../constants';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { sortTeamUserListAlphabetically } from '../utils/sortings';
import { GetUserServiceInterface } from '../interfaces/services/get.user.service.interface';
import GetAllUsersWithTeamsUseCaseDto from '../dto/useCase/get-all-users-with-teams.use-case.dto';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GET_TEAM_USER_SERVICE } from 'src/modules/teamUsers/constants';

@Injectable()
export default class GetAllUsersWithTeamsUseCase
	implements UseCase<GetAllUsersWithTeamsUseCaseDto, GetAllUsersWithTeamsPresenter>
{
	constructor(
		@Inject(TYPES.repository)
		private readonly userRepository: UserRepositoryInterface,
		@Inject(TYPES.services.GetUserService)
		private readonly getUserService: GetUserServiceInterface,
		@Inject(GET_TEAM_USER_SERVICE)
		private readonly getTeamUserService: GetTeamUserServiceInterface
	) {}

	async execute({ page, size, searchUser }: GetAllUsersWithTeamsUseCaseDto) {
		page = page ?? 0;
		size = size ?? 15;

		const [users, count] = await Promise.all([
			this.getAllUsersWithPagination(page, size, searchUser),
			this.getUserService.countUsers()
		]);

		const hasNextPage = page + 1 < Math.ceil(count / size);

		const mappedUsers: UserWithTeams[] = users.map((userFound) => {
			return {
				user: userFound,
				teamsNames: []
			};
		});

		const usersOnlyWithTeams = await this.getTeamUserService.getUsersOnlyWithTeams(users);

		const ids = new Set(usersOnlyWithTeams.map((userWithTeams) => String(userWithTeams.user._id)));

		const results = {
			userWithTeams: [
				...usersOnlyWithTeams,
				...mappedUsers.filter((user) => !ids.has(String(user.user._id)))
			],
			userAmount: count,
			hasNextPage,
			page
		};

		results.userWithTeams = sortTeamUserListAlphabetically(results.userWithTeams);

		return results;
	}

	private getAllUsersWithPagination(page?: number, size?: number, searchUser?: string) {
		return this.userRepository.getAllWithPagination(page, size, searchUser);
	}
}
