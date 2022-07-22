import { Body, Controller, Head, Inject, Param, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam,
	ApiTags
} from '@nestjs/swagger';

import { EmailParam } from 'libs/dto/param/email.param';
import { BadRequest } from 'libs/swagger/errors/bard-request.swagger';
import { InternalServerError } from 'libs/swagger/errors/internal-server-error.swagger';
import AzureLoginDto from 'modules/azure/swagger/dto/azure-login.dto';
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

	@ApiOperation({ summary: 'Login or register the user with Azure' })
	@ApiBody({
		type: AzureLoginDto,
		required: true
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Post('/')
	loginOrRegisterAzureToken(@Body() azureToken: AzureToken) {
		return this.authAzureApp.registerOrLogin(azureToken.token);
	}

	@ApiOperation({ summary: 'Validate if user exists on Azure Active Directory' })
	@ApiParam({ name: 'email', type: String, format: 'email' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Head('user/:email')
	async checkEmail(@Param() { email }: EmailParam) {
		const existUserInAzure = await this.authAzureApp.checkUserExistsInActiveDirectory(email);
		if (existUserInAzure) return 'az';

		const existUserInDB = await this.getUserApp.getByEmail(email);
		if (existUserInDB) return 'local';

		return false;
	}
}
