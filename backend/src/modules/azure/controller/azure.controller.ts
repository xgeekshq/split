import {
	Body,
	Controller,
	Get,
	HttpCode,
	Inject,
	NotFoundException,
	Param,
	Post
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
import { EmailParam } from 'src/libs/dto/param/email.param';
import { USER_NOT_FOUND } from 'src/libs/exceptions/messages';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { LoginResponse } from 'src/modules/auth/swagger/login.swagger';
import { GetUserApplicationInterface } from 'src/modules/users/interfaces/use-cases/get.user.application.interface';
import * as User from 'src/modules/users/interfaces/types';
import { AuthAzureApplicationInterface } from '../interfaces/applications/auth.azure.application.interface';
import { AzureToken } from '../interfaces/token.azure.dto';
import { TYPES } from '../interfaces/types';

@ApiTags('Azure')
@Controller('auth/azure')
export default class AzureController {
	constructor(
		@Inject(TYPES.applications.AuthAzureApplication)
		private authAzureApp: AuthAzureApplicationInterface,
		@Inject(User.TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplicationInterface
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
		schema: {
			type: 'object',
			properties: {
				token: {
					type: 'string'
				}
			}
		},
		required: true
	})
	@HttpCode(200)
	@Post('/')
	loginOrRegistetruerAzureToken(@Body() azureToken: AzureToken) {
		return this.authAzureApp.registerOrLogin(azureToken.token);
	}

	@ApiParam({
		type: String,
		format: 'email',
		required: true,
		name: 'email'
	})
	@ApiOperation({ summary: 'Verify if an user exists in Azure service' })
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
