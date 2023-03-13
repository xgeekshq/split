import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
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
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { EmailParam } from 'src/libs/dto/param/email.param';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import JwtRefreshGuard from 'src/libs/guards/jwtRefreshAuth.guard';
import LocalAuthGuard from 'src/libs/guards/localAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import CreateUserDto from 'src/modules/users/dto/create.user.dto';
import { ResetPasswordDto } from 'src/modules/users/dto/reset-password.dto';
import UserDto from 'src/modules/users/dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import { TYPES } from '../interfaces/types';
import { LoginResponse } from '../swagger/login.swagger';
import CreateGuestUserDto from 'src/modules/users/dto/create.guest.user.dto';
import { RegisterUserUseCaseInterface } from '../interfaces/applications/register-user.use-case.interface';
import { RegisterGuestUserUseCaseInterface } from '../interfaces/applications/register-guest-user.use-case.interface';
import { StatisticsAuthUserUseCaseInterface } from '../interfaces/applications/statistics.auth.use-case.interface';
import { ValidateUserEmailUseCaseInterface } from '../interfaces/applications/validate-email.use-case.interface';
import { SignInUseCaseInterface } from '../interfaces/applications/signIn.use-case.interface';
import { RefreshTokenUseCaseInterface } from '../interfaces/applications/refresh-token.use-case.interface';
import { ResetPasswordUseCaseInterface } from '../interfaces/applications/reset-password.use-case.interface';
import { CreateResetPasswordTokenUseCaseInterface } from '../interfaces/applications/create-reset-token.use-case.interface';

@ApiTags('Authentication')
@Controller('auth')
export default class AuthController {
	constructor(
		@Inject(TYPES.applications.RegisterUserUseCase)
		private registerUserUseCase: RegisterUserUseCaseInterface,
		@Inject(TYPES.applications.RegisterGuestUserUseCase)
		private registerGuestUserUseCase: RegisterGuestUserUseCaseInterface,
		@Inject(TYPES.applications.ValidateUserEmailUseCase)
		private validateUserEmailUseCase: ValidateUserEmailUseCaseInterface,
		@Inject(TYPES.applications.RefreshTokenUseCase)
		private refreshTokenUseCase: RefreshTokenUseCaseInterface,
		@Inject(TYPES.applications.StatisticsAuthUserUseCase)
		private statisticsUseCase: StatisticsAuthUserUseCaseInterface,
		@Inject(TYPES.applications.ResetPasswordUseCase)
		private resetPasswordUseCase: ResetPasswordUseCaseInterface,
		@Inject(TYPES.applications.CreateResetPasswordTokenUseCase)
		private createResetTokenUseCase: CreateResetPasswordTokenUseCaseInterface,
		@Inject(TYPES.applications.SignInUseCase)
		private signInUseCase: SignInUseCaseInterface
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
	register(@Body() registrationData: CreateUserDto) {
		return this.registerUserUseCase.execute(registrationData);
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
	login(@Req() request: RequestWithUser) {
		return this.signInUseCase.execute(request.user);
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
		return this.refreshTokenUseCase.execute(request.user._id);
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
	checkEmail(@Param() { email }: EmailParam) {
		return this.validateUserEmailUseCase.execute(email);
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
		return this.createResetTokenUseCase.execute(email);
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
	setNewPassword(@Body() { token, newPassword, newPasswordConf }: ResetPasswordDto) {
		return this.resetPasswordUseCase.execute(token, newPassword, newPasswordConf);
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

		return this.statisticsUseCase.execute(userId);
	}

	@ApiOperation({ summary: 'Create new guest user' })
	@ApiCreatedResponse({ type: UserDto, description: 'Guest user successfully created!' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post('loginGuest')
	async loginGuest(@Body() guestUserData: CreateGuestUserDto) {
		return await this.registerGuestUserUseCase.execute(guestUserData);
	}
}
