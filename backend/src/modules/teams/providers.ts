import { CreateTeamUseCase } from './applications/create-team.use-case';
import { DeleteTeamUseCase } from './applications/delete-team.use-case';
import { GetAllTeamsUseCase } from './applications/get-all-teams.use-case';
import { GetTeamUseCase } from './applications/get-team.use-case';
import { GetTeamsOfUserUseCase } from './applications/get-teams-of-user.use-case';
import { GetTeamsUserIsNotMemberUseCase } from './applications/get-teams-user-is-not-member.use-case';
import {
	CREATE_TEAM_USE_CASE,
	DELETE_TEAM_USE_CASE,
	GET_ALL_TEAMS_USE_CASE,
	GET_TEAMS_OF_USER_USE_CASE,
	GET_TEAMS_USER_IS_NOT_MEMBER_USE_CASE,
	GET_TEAM_SERVICE,
	GET_TEAM_USE_CASE,
	TEAM_REPOSITORY
} from './constants';
import { TeamRepository } from './repositories/team.repository';
import GetTeamService from './services/get.team.service';

export const createTeamUseCase = {
	provide: CREATE_TEAM_USE_CASE,
	useClass: CreateTeamUseCase
};

export const getTeamService = {
	provide: GET_TEAM_SERVICE,
	useClass: GetTeamService
};

export const getTeamsUserIsNotMemberUseCase = {
	provide: GET_TEAMS_USER_IS_NOT_MEMBER_USE_CASE,
	useClass: GetTeamsUserIsNotMemberUseCase
};

export const getAllTeamsUseCase = {
	provide: GET_ALL_TEAMS_USE_CASE,
	useClass: GetAllTeamsUseCase
};

export const getTeamUseCase = {
	provide: GET_TEAM_USE_CASE,
	useClass: GetTeamUseCase
};

export const getTeamsOfUserUseCase = {
	provide: GET_TEAMS_OF_USER_USE_CASE,
	useClass: GetTeamsOfUserUseCase
};

export const deleteTeamUseCase = {
	provide: DELETE_TEAM_USE_CASE,
	useClass: DeleteTeamUseCase
};

export const teamRepository = {
	provide: TEAM_REPOSITORY,
	useClass: TeamRepository
};
