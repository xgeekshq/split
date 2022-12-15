import { Body, Controller, Get, Inject, Put, Req, UseGuards } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import UpdateUserDto from '../dto/update.user.dto';
import UserDto from '../dto/user.dto';
import { GetUserApplication } from '../interfaces/applications/get.user.application.interface';
import { UpdateUserApplication } from '../interfaces/applications/update.user.service.interface';
import { TYPES } from '../interfaces/types';
import { UsersWithTeamsResponse } from '../swagger/users-with-teams.swagger';
import { SuperAdminGuard } from 'src/libs/guards/superAdmin.guard';
import { ForbiddenResponse } from '../../../libs/swagger/errors/forbidden.swagger';
import { NotFoundResponse } from '../../../libs/swagger/errors/not-found.swagger';
import { UpdateSuperAdminSwagger } from '../swagger/update.superadmin.swagger';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';

@ApiBearerAuth('access-token')
@ApiTags('Users')
@UseGuards(JwtAuthenticationGuard)
@Controller('users')
export default class UsersController {
	constructor(
		@Inject(TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplication,
		@Inject(TYPES.applications.UpdateUserApplication)
		private updateUserApp: UpdateUserApplication
	) {}

	@ApiOperation({ summary: 'Retrieve a list of existing users' })
	@ApiOkResponse({ description: 'Users successfully retrieved!', type: UserDto, isArray: true })
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
	getAllUsers() {
		return this.getUserApp.getAllUsers();
	}

	@ApiOperation({ summary: 'Retrieve the list of users with and without teams' })
	@ApiOkResponse({
		description: 'Users successfully retrieved!',
		type: UsersWithTeamsResponse,
		isArray: true
	})
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
	@Get('teams')
	getAllUsersWithTeams() {
		return this.getUserApp.getUsersOnlyWithTeams();
	}

	@ApiOperation({ summary: 'Update user is super admin' })
	@ApiBody({ type: UpdateSuperAdminSwagger })
	@ApiOkResponse({
		description: 'User successfully updated!',
		type: UserDto
	})
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
	@Put('/sadmin')
	updateUserSuperAdmin(@Req() request: RequestWithUser, @Body() userData: UpdateUserDto) {
		return this.updateUserApp.updateSuperAdmin(userData, request.user);
	}
}
