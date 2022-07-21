import { Body, Controller, Head, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EmailParam } from 'libs/dto/param/email.param';
import { GetUserApplication } from 'modules/users/interfaces/applications/get.user.application.interface';
import * as User from 'modules/users/interfaces/types';

import { AuthAzureApplication } from '../interfaces/applications/auth.azure.application.interface';
import { AzureToken } from '../interfaces/token.azure.dto';
import { TYPES } from '../interfaces/types';

@ApiTags('Authentication')
@Controller('auth/azure')
export default class AzureController {
	constructor(
		@Inject(TYPES.applications.AuthAzureApplication)
		private authAzureApp: AuthAzureApplication,
		@Inject(User.TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplication
	) {}

	@Post('/')
	loginOrRegisterAzureToken(@Body() azureToken: AzureToken) {
		return this.authAzureApp.registerOrLogin(azureToken.token);
	}

	@Head('user/:email')
	async checkEmail(@Param() { email }: EmailParam) {
		const existUserInAzure = await this.authAzureApp.checkUserExistsInActiveDirectory(email);
		if (existUserInAzure) return 'az';

		const existUserInDB = await this.getUserApp.getByEmail(email);
		if (existUserInDB) return 'local';

		return false;
	}
}
