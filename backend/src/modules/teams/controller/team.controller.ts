import { TeamUserUseCaseInterface } from './../../teamUsers/interfaces/applications/team-user.use-case.interface';
import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Put,
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
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
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
import { NotFoundResponse } from '../../../libs/swagger/errors/not-found.swagger';
import { CreateTeamDto } from '../dto/crate-team.dto';
import TeamDto from '../dto/team.dto';
import TeamUserDto from '../../teamUsers/dto/team.user.dto';
import UpdateTeamUserDto from '../../teamUsers/dto/update.team.user.dto';
import { TYPES } from '../interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { SuperAdminGuard } from 'src/libs/guards/superAdmin.guard';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { DeleteTeamApplicationInterface } from '../interfaces/applications/delete.team.application.interface';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';

const TeamUserPermission = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Teams')
@UseGuards(JwtAuthenticationGuard)
@Controller('teams')
export default class TeamsController {
	constructor(
		@Inject(TYPES.applications.CreateTeamApplication)
		private createTeamApp: CreateTeamApplicationInterface,
		@Inject(TYPES.applications.GetTeamApplication)
		private getTeamApp: GetTeamApplicationInterface,
		@Inject(TYPES.applications.DeleteTeamApplication)
		private deleteTeamApp: DeleteTeamApplicationInterface,
		@Inject(TeamUsers.TYPES.applications.CreateTeamUserUseCase)
		private createTeamUserUseCase: TeamUserUseCaseInterface<TeamUserDto, TeamUser>,
		@Inject(TeamUsers.TYPES.applications.CreateTeamUsersUseCase)
		private createTeamUsersUseCase: TeamUserUseCaseInterface<TeamUserDto[], TeamUser[]>,
		@Inject(TeamUsers.TYPES.applications.UpdateTeamUserUseCase)
		private updateTeamUserUseCase: TeamUserUseCaseInterface<TeamUserDto, TeamUser>,
		@Inject(TeamUsers.TYPES.applications.AddAndRemoveTeamUsersUseCase)
		private addAndRemoveTeamUsersUseCase: TeamUserUseCaseInterface<UpdateTeamUserDto, TeamUser[]>,
		@Inject(TeamUsers.TYPES.applications.DeleteTeamUserUseCase)
		private deleteTeamUserUseCase: TeamUserUseCaseInterface<string, TeamUser>
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
		return this.createTeamApp.create(teamData);
	}

	@ApiOperation({ summary: 'Add a user to an existing team' })
	@ApiOkResponse({ description: 'User successfully added to the team!', type: TeamUserDto })
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
	@Put()
	createTeamUser(@Body() teamUserData: TeamUserDto) {
		return this.createTeamUserUseCase.execute(teamUserData);
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
	@Get()
	getAllTeams(@Req() request: RequestWithUser) {
		return this.getTeamApp.getAllTeams(request.user);
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
		return this.getTeamApp.getTeamsOfUser(userId ?? request.user._id);
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
		return this.getTeamApp.getTeam(teamId, teamQueryParams);
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
		return this.getTeamApp.getTeamsUserIsNotMember(userId);
	}

	@ApiOperation({ summary: 'Update a specific team member' })
	@ApiParam({ type: String, name: 'teamId', required: true })
	@ApiBody({ type: TeamUserDto })
	@ApiOkResponse({
		type: TeamUserDto,
		description: 'Team member updated successfully!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'Not found!'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
		type: ForbiddenResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@TeamUserPermission([TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(TeamUserGuard)
	@Put(':teamId')
	updateTeamUser(@Body() teamUserData: TeamUserDto) {
		return this.updateTeamUserUseCase.execute(teamUserData);
	}

	@ApiOperation({ summary: 'Add and remove team members' })
	@ApiParam({ type: String, name: 'teamId', required: true })
	@ApiBody({ type: UpdateTeamUserDto })
	@ApiOkResponse({
		type: TeamUserDto,
		description: 'Team member updated successfully!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'Not found!'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
		type: ForbiddenResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@TeamUserPermission([TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(TeamUserGuard)
	@Put('/:teamId/addAndRemove')
	addAndRemoveTeamUsers(@Body() users: UpdateTeamUserDto) {
		return this.addAndRemoveTeamUsersUseCase.execute(users);
	}

	@ApiOperation({ summary: 'Add team members' })
	@ApiBody({ type: TeamUserDto })
	@ApiOkResponse({
		type: TeamUserDto,
		description: 'Team member updated successfully!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'Not found!'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
		type: ForbiddenResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@UseGuards(SuperAdminGuard)
	@Put('add/user')
	addTeamUsers(@Body() teamUsers: TeamUserDto[]) {
		return this.createTeamUsersUseCase.execute(teamUsers);
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
		return this.deleteTeamApp.delete(teamId);
	}

	@ApiOperation({ summary: 'Delete a specific team of a user' })
	@ApiParam({ type: String, name: 'userId', required: true })
	@ApiOkResponse({ type: Boolean, description: 'Team of user successfully deleted!' })
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
	@UseGuards(SuperAdminGuard)
	@Delete('/user/:teamUserId')
	deleteTeamUser(@Param() { teamUserId }: UserTeamsParams) {
		return this.deleteTeamUserUseCase.execute(teamUserId);
	}
}
