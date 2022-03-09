import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { AuthAzureApplication } from '../interfaces/applications/auth.azure.application.interface';
import { AzureToken } from '../interfaces/token.azure.dto';
import { TYPES } from '../interfaces/types';

@Controller('auth')
export default class AzureController {
  constructor(
    @Inject(TYPES.applications.AuthAzureApplication)
    private authAzureApp: AuthAzureApplication,
  ) {}

  @Post('signAzure')
  loginOrRegisterAzureToken(@Body() azureToken: AzureToken) {
    return this.authAzureApp.registerOrLogin(azureToken.token);
  }

  @Get('checkUserExists/:email')
  checkUserExists(@Req() request) {
    const { email } = request.params;
    return this.authAzureApp.checkUserExistsInActiveDirectory(email);
  }
}
