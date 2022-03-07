import { Inject, Injectable } from '@nestjs/common';
import { AuthAzureApplication } from '../interfaces/applications/auth.azure.application.interface';
import { AuthAzureService } from '../interfaces/services/auth.azure.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class AuthAzureApplicationImpl implements AuthAzureApplication {
  constructor(
    @Inject(TYPES.services.AuthAzureService)
    private authAzureService: AuthAzureService,
  ) {}

  registerOrLogin(azureToken: string) {
    return this.authAzureService.loginOrRegisterAzureToken(azureToken);
  }

  checkUserExistsInActiveDirectory(email: string) {
    return this.authAzureService.checkUserExistsInActiveDirectory(email);
  }
}
