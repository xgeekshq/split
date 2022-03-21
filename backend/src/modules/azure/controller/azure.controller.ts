import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { EmailParam } from '../../../libs/dto/param/email.param';
import { AuthAzureApplication } from '../interfaces/applications/auth.azure.application.interface';
import { AzureToken } from '../interfaces/token.azure.dto';
import { TYPES } from '../interfaces/types';
import * as User from '../../users/interfaces/types';
import { GetUserApplication } from '../../users/interfaces/applications/get.user.application.interface';

@Controller('auth')
export default class AzureController {
  constructor(
    @Inject(TYPES.applications.AuthAzureApplication)
    private authAzureApp: AuthAzureApplication,
    @Inject(User.TYPES.applications.GetUserApplication)
    private getUserApp: GetUserApplication,
  ) {}

  @Post('signAzure')
  loginOrRegisterAzureToken(@Body() azureToken: AzureToken) {
    return this.authAzureApp.registerOrLogin(azureToken.token);
  }

  @Get('checkUserEmailAD/:email')
  async checkEmail(@Param() emailParam: EmailParam) {
    const { email } = emailParam;
    const existAzure = await this.authAzureApp.checkUserExistsInActiveDirectory(
      email,
    );
    if (existAzure) return 'az';
    const existDB = await this.getUserApp.getByEmail(email);
    if (existDB) return 'local';
    return false;
  }
}
