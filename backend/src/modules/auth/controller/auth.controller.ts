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
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { uniqueViolation } from 'src/infrastructure/database/errors/unique.user';
import { EmailParam } from 'src/libs/dto/param/email.param';
import { EMAIL_EXISTS, UPDATE_FAILED, USER_NOT_FOUND } from 'src/libs/exceptions/messages';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import JwtRefreshGuard from 'src/libs/guards/jwtRefreshAuth.guard';
import LocalAuthGuard from 'src/libs/guards/localAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { GetBoardApplicationInterface } from 'src/modules/boards/interfaces/applications/get.board.application.interface';
import * as Boards from 'src/modules/boards/interfaces/types';
import { GetTeamApplicationInterface } from 'src/modules/teams/interfaces/applications/get.team.application.interface';
import * as Teams from 'src/modules/teams/interfaces/types';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { ResetPasswordDto } from 'src/modules/users/dto/reset-password.dto';
import UserDto from 'src/modules/users/dto/user.dto';
import { GetUserApplication } from 'src/modules/users/interfaces/applications/get.user.application.interface';
import { UpdateUserApplication } from 'src/modules/users/interfaces/applications/update.user.service.interface';
import * as User from 'src/modules/users/interfaces/types';
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
	@ApiCreatedResponse({ type: UserDto, description: 'User successfully created!' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
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
	@ApiOkResponse({
		description: 'User logged successfully!',
		type: LoginResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'User not found'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
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

		if (!loggedUser) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		return loggedUser;
	}

	@ApiOperation({ summary: 'Generate a new refresh token' })
	@ApiOkResponse({
		schema: {
			type: 'object',
			properties: {
				expiresIn: {
					type: 'number',
					default: 3600
				},
				token: {
					type: 'string'
				}
			}
		},
		description: 'Token successfully generated!'
	})
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
	@ApiBearerAuth('refresh-token')
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
		description: 'Return a boolean to indicate if the user exists or not',
		schema: {
			type: 'boolean',
			default: false
		}
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get('users/:email')
	checkEmail(@Param() { email }: EmailParam): Promise<boolean> {
		return this.getUserApp.getByEmail(email).then((user) => !!user);
	}

	@ApiOperation({ summary: 'Request a reset password link' })
	@ApiOkResponse({ description: 'Email with link to reset password send successfully!' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Patch('password/reset')
	forgot(@Body() { email }: EmailParam) {
		return this.createResetTokenAuthApp.create(email);
	}

	@ApiOperation({
		summary: 'Change user password after a reset password request'
	})
	@ApiOkResponse({
		description: 'User password successfully changed!',
		schema: {
			type: 'object',
			properties: {
				status: {
					type: 'string',
					default: 'ok'
				},
				message: {
					type: 'string',
					default: 'Password updated successfully!'
				}
			}
		}
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		type: UnauthorizedResponse,
		description: 'Invalid token'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Patch('password')
	@HttpCode(HttpStatus.OK)
	async setNewPassword(@Body() { token, newPassword, newPasswordConf }: ResetPasswordDto) {
		const email = await this.updateUserApp.checkEmail(token);

		if (!email) {
			throw new UnauthorizedException('Invalid token!');
		}

		const result = await this.updateUserApp.setPassword(email, newPassword, newPasswordConf);

		if (!result) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return {
			status: 'ok',
			message: 'Password updated successfully!'
		};
	}

	@ApiOperation({
		summary: 'Get statistics to show on dashboard',
		description: 'This method return the number of users, teams and boards'
	})
	@ApiBearerAuth('access-token')
	@ApiOkResponse({
		description: 'Statistics successfully retrieved!',
		schema: {
			type: 'object',
			properties: {
				usersCount: {
					type: 'number',
					example: 1
				},
				teamsCount: {
					type: 'number',
					example: 1
				},
				boardsCount: {
					type: 'number',
					example: 1
				}
			}
		}
	})
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
	@ApiBearerAuth('access-token')
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
