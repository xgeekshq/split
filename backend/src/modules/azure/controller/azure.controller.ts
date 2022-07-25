import {
	Body,
	Controller,
	Get,
	HttpCode,
	Inject,
	NotFoundException,
	Param,
	Post,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { EmailParam } from 'libs/dto/param/email.param';
import { USER_NOT_FOUND } from 'libs/exceptions/messages';
import LocalAuthGuard from 'libs/guards/localAuth.guard';
import { BadRequestResponse } from 'libs/swagger/errors/bard-request.swagger';
import { InternalServerErrorResponse } from 'libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'libs/swagger/errors/unauthorized.swagger';
import { LoginDto } from 'modules/auth/dto/login.dto';
import { LoginResponse } from 'modules/auth/swagger/login.swagger';
import { GetUserApplication } from 'modules/users/interfaces/applications/get.user.application.interface';
import * as User from 'modules/users/interfaces/types';

import { AuthAzureApplication } from '../interfaces/applications/auth.azure.application.interface';
import { AzureToken } from '../interfaces/token.azure.dto';
import { TYPES } from '../interfaces/types';

@ApiTags('Azure')
@Controller('auth/azure')
export default class AzureController {
	constructor(
		@Inject(TYPES.applications.AuthAzureApplication)
		private authAzureApp: AuthAzureApplication,
		@Inject(User.TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplication
	) {}

	@ApiOperation({
		summary: 'Register or Login a user through Azure service'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiOkResponse({
		description: 'User logged successfully!',
		type: LoginResponse
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
	@Post('/')
	loginOrRegisterAzureToken(@Body() azureToken: AzureToken) {
		return this.authAzureApp.registerOrLogin(azureToken.token);
	}

	@ApiParam({
		type: String,
		format: 'email',
		required: true,
		name: 'email'
	})
	@ApiOperation({ summary: 'Verify if a user exists in Azure service' })
	@ApiOkResponse({
		description:
			'Return "az" if user exists Active Directory or "local" if user exists on database.',
		schema: {
			type: 'string',
			default: 'local',
			examples: ['az', 'local']
		}
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiNotFoundResponse({ description: 'User not found', type: NotFoundResponse })
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get('users/:email')
	async checkEmail(@Param() { email }: EmailParam) {
		const existUserInAzure = await this.authAzureApp.checkUserExistsInActiveDirectory(email);

		if (existUserInAzure) {
			return 'az';
		}

		const existUserInDB = await this.getUserApp.getByEmail(email);

		if (existUserInDB) {
			return 'local';
		}

		throw new NotFoundException(USER_NOT_FOUND);
	}
}
