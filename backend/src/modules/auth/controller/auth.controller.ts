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
	Post,
	Req,
	UseGuards
} from '@nestjs/common';

import { uniqueViolation } from 'infrastructure/database/errors/unique.user';
import { EmailParam } from 'libs/dto/param/email.param';
import { EMAIL_EXISTS, USER_NOT_FOUND } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import JwtRefreshGuard from 'libs/guards/jwtRefreshAuth.guard';
import LocalAuthGuard from 'libs/guards/localAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import { GetBoardApplicationInterface } from 'modules/boards/interfaces/applications/get.board.application.interface';
import * as Boards from 'modules/boards/interfaces/types';
import { GetTeamApplicationInterface } from 'modules/teams/interfaces/applications/get.team.application.interface';
import * as Teams from 'modules/teams/interfaces/types';
import CreateUserDto from 'modules/users/dto/create.user.dto';
import { ResetPasswordDto } from 'modules/users/dto/reset-password.dto';
import { GetUserApplication } from 'modules/users/interfaces/applications/get.user.application.interface';
import { UpdateUserApplication } from 'modules/users/interfaces/applications/update.user.service.interface';
import * as User from 'modules/users/interfaces/types';

import { CreateResetTokenAuthApplication } from '../interfaces/applications/create-reset-token.auth.application.interface';
import { GetTokenAuthApplication } from '../interfaces/applications/get-token.auth.application.interface';
import { RegisterAuthApplication } from '../interfaces/applications/register.auth.application.interface';
import { TYPES } from '../interfaces/types';
import { signIn } from '../shared/login.auth';

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

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() request: RequestWithUser) {
		const loggedUser = await signIn(request.user, this.getTokenAuthApp, 'local');
		if (!loggedUser) throw new NotFoundException(USER_NOT_FOUND);

		return loggedUser;
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	refresh(@Req() request: RequestWithUser) {
		return this.getTokenAuthApp.getAccessToken(request.user._id);
	}

	@Get('checkUserEmail/:email')
	checkEmail(@Param() { email }: EmailParam): Promise<boolean> {
		return this.getUserApp.getByEmail(email).then((user) => !!user);
	}

	@Post('recoverPassword')
	forgot(@Body() { email }: EmailParam) {
		return this.createResetTokenAuthApp.create(email);
	}

	@Post('updatepassword')
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

	@UseGuards(JwtAuthenticationGuard)
	@Get('/dashboardStatistics')
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
