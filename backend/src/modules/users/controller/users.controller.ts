import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import { BadRequestResponse } from 'libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'libs/swagger/errors/unauthorized.swagger';

// import TeamDto from '../dto/team.dto';
import { GetUserApplication } from '../interfaces/applications/get.user.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Users')
@UseGuards(JwtAuthenticationGuard)
@Controller('users')
export default class UsersController {
	constructor(
		@Inject(TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplication
	) {}

	@ApiOperation({ summary: 'Retrieve a list of existing users' })
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
		return this.getUserApp.getAllUsers();
	}
}
