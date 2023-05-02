import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Query,
	Req,
	SetMetadata,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { TeamParams } from 'src/libs/dto/param/team.params';
import { TeamQueryParams } from 'src/libs/dto/param/team.query.params';
import { UserTeamsParams } from 'src/libs/dto/param/user.teams.param';
import { TeamRoles } from 'src/libs/enum/team.roles';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { TeamUserGuard } from '../../../libs/guards/teamRoles.guard';
import { ForbiddenResponse } from '../../../libs/swagger/errors/forbidden.swagger';
import { CreateTeamDto } from '../dto/create-team.dto';
import TeamDto from '../dto/team.dto';
import {
	CREATE_TEAM_USE_CASE,
	DELETE_TEAM_USE_CASE,
	GET_ALL_TEAMS_USE_CASE,
	GET_TEAMS_OF_USER_USE_CASE,
	GET_TEAMS_USER_IS_NOT_MEMBER_USE_CASE,
	GET_TEAM_USE_CASE
} from '../constants';
import { SuperAdminGuard } from 'src/libs/guards/superAdmin.guard';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Team from '../entities/team.schema';
import { GetTeamUseCaseDto } from '../dto/use-cases/get-team.use-case.dto';

const TeamUserPermission = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Teams')
@UseGuards(JwtAuthenticationGuard)
@Controller('teams')
export default class TeamsController {
	constructor(
		@Inject(CREATE_TEAM_USE_CASE)
		private readonly createTeamUseCase: UseCase<CreateTeamDto, Team>,
		@Inject(GET_ALL_TEAMS_USE_CASE)
		private readonly getAllTeamsUseCase: UseCase<void, Team[]>,
		@Inject(GET_TEAMS_OF_USER_USE_CASE)
		private readonly getTeamsOfUserUseCase: UseCase<string, Team[]>,
		@Inject(GET_TEAM_USE_CASE)
		private readonly getTeamUseCase: UseCase<GetTeamUseCaseDto, Team>,
		@Inject(GET_TEAMS_USER_IS_NOT_MEMBER_USE_CASE)
		private readonly getTeamsUserIsNotMemberUseCase: UseCase<string, Team[]>,
		@Inject(DELETE_TEAM_USE_CASE)
		private readonly deleteTeamUseCase: UseCase<string, boolean>
	) {}

	@ApiOperation({ summary: 'Create a new team' })
	@ApiCreatedResponse({ description: 'Team successfully created!', type: TeamDto })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post()
	create(@Body() teamData: CreateTeamDto) {
		return this.createTeamUseCase.execute(teamData);
	}

	@ApiOperation({ summary: 'Retrieve a list of existing teams' })
	@ApiOkResponse({ description: 'Teams successfully retrieved!', type: TeamDto, isArray: true })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@UseGuards(SuperAdminGuard)
	@Get()
	getAllTeams() {
		return this.getAllTeamsUseCase.execute();
	}

	@ApiOperation({ summary: 'Retrieve a list of teams that belongs to an user' })
	@ApiOkResponse({ description: 'Teams successfully retrieved!', type: TeamDto, isArray: true })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get('user')
	async getTeamsOfUser(@Req() request: RequestWithUser, @Query() { userId }: UserTeamsParams) {
		return this.getTeamsOfUserUseCase.execute(userId ?? request.user._id);
	}

	@ApiOperation({ summary: 'Get a specific team' })
	@ApiParam({ name: 'teamId', type: String })
	@ApiQuery({
		name: 'teamUserRole',
		type: String,
		enum: TeamRoles,
		required: false
	})
	@ApiQuery({
		name: 'loadUsers',
		type: Boolean,
		required: false
	})
	@ApiOkResponse({ description: 'Team successfully retrieved!', type: TeamDto })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get(':teamId')
	@UsePipes(new ValidationPipe({ transform: true }))
	getTeam(@Param() { teamId }: TeamParams, @Query() teamQueryParams?: TeamQueryParams) {
		return this.getTeamUseCase.execute({ teamId, teamQueryParams });
	}

	@ApiOperation({ summary: 'Retrieve a list of teams that dont belong to an user' })
	@ApiOkResponse({ description: 'Teams successfully retrieved!', type: TeamDto, isArray: true })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get('not/:userId')
	@UseGuards(SuperAdminGuard)
	getTeamsUserIsNotMember(@Param() { userId }: UserTeamsParams) {
		return this.getTeamsUserIsNotMemberUseCase.execute(userId);
	}

	@ApiOperation({ summary: 'Delete a specific team' })
	@ApiParam({ type: String, name: 'teamId', required: true })
	@ApiOkResponse({ type: Boolean, description: 'Team successfully deleted!' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
		type: ForbiddenResponse
	})
	@TeamUserPermission([TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(TeamUserGuard)
	@Delete(':teamId')
	deleteTeam(@Param() { teamId }: TeamParams) {
		return this.deleteTeamUseCase.execute(teamId);
	}
}
