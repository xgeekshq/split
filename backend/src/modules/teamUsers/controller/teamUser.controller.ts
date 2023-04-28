import { UseCase } from 'src/libs/interfaces/use-case.interface';
import {
	Body,
	Controller,
	Delete,
	Inject,
	Param,
	Put,
	SetMetadata,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UserTeamsParams } from 'src/libs/dto/param/user.teams.param';
import { TeamRoles } from 'src/libs/enum/team.roles';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { TeamUserGuard } from '../../../libs/guards/teamRoles.guard';
import { ForbiddenResponse } from '../../../libs/swagger/errors/forbidden.swagger';
import { NotFoundResponse } from '../../../libs/swagger/errors/not-found.swagger';
import TeamUserDto from '../dto/team.user.dto';
import UpdateTeamUserDto from '../dto/update.team.user.dto';
import { SuperAdminGuard } from 'src/libs/guards/superAdmin.guard';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
import {
	ADD_AND_REMOVE_TEAM_USER_USE_CASE,
	CREATE_TEAM_USERS_USE_CASE,
	CREATE_TEAM_USER_USE_CASE,
	DELETE_TEAM_USER_USE_CASE,
	UPDATE_TEAM_USER_USE_CASE
} from 'src/modules/teamUsers/constants';

const TeamUserPermission = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Teams')
@UseGuards(JwtAuthenticationGuard)
@Controller('teams')
export default class TeamUsersController {
	constructor(
		@Inject(CREATE_TEAM_USER_USE_CASE)
		private readonly createTeamUserUseCase: UseCase<TeamUserDto, TeamUser>,
		@Inject(CREATE_TEAM_USERS_USE_CASE)
		private readonly createTeamUsersUseCase: UseCase<TeamUserDto[], TeamUser[]>,
		@Inject(UPDATE_TEAM_USER_USE_CASE)
		private readonly updateTeamUserUseCase: UseCase<TeamUserDto, TeamUser>,
		@Inject(ADD_AND_REMOVE_TEAM_USER_USE_CASE)
		private readonly addAndRemoveTeamUsersUseCase: UseCase<UpdateTeamUserDto, TeamUser[]>,
		@Inject(DELETE_TEAM_USER_USE_CASE)
		private readonly deleteTeamUserUseCase: UseCase<string, TeamUser>
	) {}

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
