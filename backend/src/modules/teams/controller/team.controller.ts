import {
	BadRequestException,
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
import { TeamRoles } from 'src/libs/enum/team.roles';
import { INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { TeamUserGuard } from '../../../libs/guards/teamRoles.guard';
import { ForbiddenResponse } from '../../../libs/swagger/errors/forbidden.swagger';
import { NotFoundResponse } from '../../../libs/swagger/errors/not-found.swagger';
import { DeleteTeamApplication } from '../applications/delete.team.application';
import { UpdateTeamApplication } from '../applications/update.team.application';
import { CreateTeamDto } from '../dto/crate-team.dto';
import TeamDto from '../dto/team.dto';
import TeamUserDto from '../dto/team.user.dto';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { TYPES } from '../interfaces/types';

const TeamUser = (permission: string) => SetMetadata('permission', permission);

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
		@Inject(TYPES.applications.UpdateTeamApplication)
		private updateTeamApp: UpdateTeamApplication,
		@Inject(TYPES.applications.DeleteTeamApplication)
		private deleteTeamApp: DeleteTeamApplication
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
	async create(@Body() teamData: CreateTeamDto) {
		const team = await this.createTeamApp.create(teamData);

		if (!team) throw new BadRequestException(INSERT_FAILED);

		return team;
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
	async createTeamUser(@Body() teamData: TeamUserDto) {
		const team = await this.createTeamApp.createTeamUser(teamData);

		if (!team) {
			throw new BadRequestException(INSERT_FAILED);
		}

		return team;
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
	getAllTeams() {
		return this.getTeamApp.getAllTeams();
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
	getTeamsOfUser(@Req() request: RequestWithUser) {
		return this.getTeamApp.getTeamsOfUser(request.user._id);
	}

	@ApiOperation({ summary: 'Get a list of users belongs to the team' })
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
	@TeamUser(TeamRoles.ADMIN)
	@UseGuards(TeamUserGuard)
	@Put(':teamId')
	async updateTeamUser(@Body() teamData: TeamUserDto) {
		const teamUser = await this.updateTeamApp.updateTeamUser(teamData);

		if (!teamUser) throw new BadRequestException(UPDATE_FAILED);

		return teamUser;
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
	@TeamUser(TeamRoles.ADMIN)
	// @TeamUser(TeamRoles.STAKEHOLDER)
	@UseGuards(TeamUserGuard)
	@Delete(':teamId')
	async deleteTeam(@Param() { teamId }: TeamParams) {
		return await this.deleteTeamApp.delete(teamId);
	}
}
