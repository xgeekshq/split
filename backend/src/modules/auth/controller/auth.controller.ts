import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { uniqueViolation } from 'infrastructure/database/errors/unique.user';
import { EmailParam } from 'libs/dto/param/email.param';
import { EMAIL_EXISTS, USER_NOT_FOUND } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import JwtRefreshGuard from 'libs/guards/jwtRefreshAuth.guard';
import LocalAuthGuard from 'libs/guards/localAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import { BadRequest } from 'libs/swagger/errors/bard-request.swagger';
import { InternalServerError } from 'libs/swagger/errors/internal-server-error.swagger';
import { Unauthorized } from 'libs/swagger/errors/unauthorized.swagger';
import { GetBoardApplicationInterface } from 'modules/boards/interfaces/applications/get.board.application.interface';
import * as Boards from 'modules/boards/interfaces/types';
import { GetTeamApplicationInterface } from 'modules/teams/interfaces/applications/get.team.application.interface';
import * as Teams from 'modules/teams/interfaces/types';
import CreateUserDto from 'modules/users/dto/create.user.dto';
import { ResetPasswordDto } from 'modules/users/dto/reset-password.dto';
import { GetUserApplication } from 'modules/users/interfaces/applications/get.user.application.interface';
import { UpdateUserApplication } from 'modules/users/interfaces/applications/update.user.service.interface';
import * as User from 'modules/users/interfaces/types';

import { LoginDto } from '../dto/login.dto';
import { CreateResetTokenAuthApplication } from '../interfaces/applications/create-reset-token.auth.application.interface';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { RegisterAuthApplication } from '../interfaces/applications/register.auth.application.interface';
import { TYPES } from '../interfaces/types';
import { signIn } from '../shared/login.auth';
import { LoginResponse } from '../swagger/login.swagger';

@ApiTags('Authentication')
@Controller('auth')
export default class AuthController {
	constructor(
		@Inject(TYPES.applications.RegisterAuthApplication)
		private registerAuthApp: RegisterAuthApplication,
		@Inject(TYPES.applications.GetTokenAuthApplication)
		private getTokenAuthApp: GetTokenAuthApplication,
		@Inject(User.TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplication,
		@Inject(Teams.TYPES.applications.GetTeamApplication)
		private getTeamsApp: GetTeamApplicationInterface,
		@Inject(Boards.TYPES.applications.GetBoardApplication)
		private getBoardApp: GetBoardApplicationInterface,
		@Inject(TYPES.applications.CreateResetTokenAuthApplication)
		private createResetTokenAuthApp: CreateResetTokenAuthApplication,
		@Inject(TYPES.applications.UpdateUserApplication)
		private updateUserApp: UpdateUserApplication
	) {}

	@ApiOperation({ summary: 'Create new user' })
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Post('register')
	async register(@Body() registrationData: CreateUserDto) {
		try {
			const { _id, firstName, lastName, email } = await this.registerAuthApp.register(
				registrationData
			);

			return { _id, firstName, lastName, email };
		} catch (error) {
			if (error.code === uniqueViolation) {
				throw new BadRequestException(EMAIL_EXISTS);
			}
			throw new BadRequestException(error.message);
		}
	}

	@ApiOperation({
		summary: 'Basic login to allow the user perform certain actions'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiOkResponse({
		description: 'User logged successfully!',
		type: LoginResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@ApiBody({
		type: LoginDto,
		required: true
	})
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() request: RequestWithUser) {
		const loggedUser = await signIn(request.user, this.getTokenAuthApp, 'local');
		if (!loggedUser) throw new NotFoundException(USER_NOT_FOUND);

		return loggedUser;
	}

	@ApiOperation({ summary: 'Generate a new refresh token' })
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@ApiBearerAuth('refresh-token')
	@UseGuards(JwtRefreshGuard)
	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	refresh(@Req() request: RequestWithUser) {
		return this.getTokenAuthApp.getAccessToken(request.user._id);
	}

	@ApiParam({
		type: String,
		format: 'email',
		required: true,
		name: 'email'
	})
	@ApiOperation({ summary: 'Verify if user exists' })
	@ApiOkResponse({
		description: 'Return a boolean to indicate if the user exists or not'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Get('checkUserEmail/:email')
	checkEmail(@Param() { email }: EmailParam): Promise<boolean> {
		return this.getUserApp.getByEmail(email).then((user) => !!user);
	}

	@ApiOperation({ summary: 'Request a reset password link' })
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Patch('password/reset')
	forgot(@Body() { email }: EmailParam) {
		return this.createResetTokenAuthApp.create(email);
	}

	@ApiOperation({
		summary: 'Change user password after a reset password request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Patch('password')
	@HttpCode(HttpStatus.OK)
	async setNewPassword(@Body() { token, newPassword, newPasswordConf }: ResetPasswordDto) {
		const email = await this.updateUserApp.checkEmail(token);
		if (!email) return { message: 'token not valid' };
		return (
			(await this.updateUserApp.setPassword(email, newPassword, newPasswordConf)) && {
				status: 'ok',
				message: 'Password updated successfully!'
			}
		);
	}

	@ApiOperation({
		summary: 'Get statistics to show on dashboard',
		description: 'This method return the number of users, teams and boards'
	})
	@ApiBearerAuth('access-token')
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@UseGuards(JwtAuthenticationGuard)
	@Get('/statistics')
	async getDashboardHeaderInfo(@Req() request: RequestWithUser) {
		const { _id: userId } = request.user;
		const [usersCount, teamsCount, boardsCount] = await Promise.all([
			this.getUserApp.countUsers(),
			this.getTeamsApp.countTeams(userId),
			this.getBoardApp.countBoards(userId)
		]);
		return { usersCount, teamsCount, boardsCount };
	}
}
