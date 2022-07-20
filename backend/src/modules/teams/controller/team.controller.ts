import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { TeamParams } from 'libs/dto/param/team.params';
import { TeamQueryParams } from 'libs/dto/param/team.query.params';
import { INSERT_FAILED } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import { BadRequest } from 'libs/swagger/errors/bard-request.swagger';
import { InternalServerError } from 'libs/swagger/errors/internal-server-error.swagger';
import { Unauthorized } from 'libs/swagger/errors/unauthorized.swagger';

import { CreateTeamDto } from '../dto/crate-team.dto';
import TeamDto from '../dto/team.dto';
import TeamUserDto from '../dto/team.user.dto';
import { CreateTeamApplicationInterface } from '../interfaces/applications/create.team.application.interface';
import { GetTeamApplicationInterface } from '../interfaces/applications/get.team.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Teams')
@UseGuards(JwtAuthenticationGuard)
@Controller('teams')
export default class TeamsController {
	constructor(
		@Inject(TYPES.applications.CreateTeamApplication)
		private createTeamApp: CreateTeamApplicationInterface,
		@Inject(TYPES.applications.GetTeamApplication)
		private getTeamApp: GetTeamApplicationInterface
	) {}

	@ApiOperation({ summary: 'Create a new team' })
	@ApiCreatedResponse({ description: 'Team successfully created!', type: TeamDto })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Post()
	async create(@Req() request: RequestWithUser, @Body() teamData: CreateTeamDto) {
		const team = await this.createTeamApp.create(teamData, request.user._id);
		if (!team) throw new BadRequestException(INSERT_FAILED);
		return team;
	}

	@ApiOperation({ summary: 'Add a user to an existing team' })
	@ApiOkResponse({ description: 'User successfully added to the team!' })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put()
	async createTeamUser(@Body() teamData: TeamUserDto) {
		const team = await this.createTeamApp.createTeamUser(teamData);
		if (!team) throw new BadRequestException(INSERT_FAILED);
		return team;
	}

	@ApiOperation({ summary: 'Retrieve a list of existing teams' })
	@ApiOkResponse({ description: 'Teams successfully retrieved!' })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Get()
	getAllTeams() {
		return this.getTeamApp.getAllTeams();
	}

	@ApiOperation({ summary: 'Get a list of users belongs to the team' })
	@ApiOkResponse({ description: 'Team successfully retrieved!' })
	@ApiParam({ name: 'teamId', type: String })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Get(':teamId')
	@UsePipes(new ValidationPipe({ transform: true }))
	getTeam(@Param() { teamId }: TeamParams, @Query() teamQueryParams?: TeamQueryParams) {
		return this.getTeamApp.getTeam(teamId, teamQueryParams);
	}
}
