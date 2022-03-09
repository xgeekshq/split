import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserService } from '../../users/interfaces/services/create.user.service.interface';
import { GetUserService } from '../../users/interfaces/services/get.user.service.interface';
import * as UserType from '../../users/interfaces/types';
import * as AuthType from '../../auth/interfaces/types';
import { GetTokenAuthService } from '../../auth/interfaces/services/get-token.auth.service.interface';
import { AuthAzureService } from '../interfaces/services/auth.azure.service.interface';
import { signIn } from '../../auth/shared/login.auth';
import { TYPES } from '../interfaces/types';
import { CronAzureService } from '../interfaces/services/cron.azure.service.interface';
import isEmpty from '../../../libs/utils/isEmpty';

interface AzureUserFound {
  mail: string | undefined;
  displayName: string | undefined;
  userPrincipalName: string | undefined;
}

interface AzureDecodedUser {
  unique_name: string;
  email: string;
  given_name: string;
  family_name: string;
}

@Injectable()
export default class AuthAzureServiceImpl implements AuthAzureService {
  constructor(
    @Inject(UserType.TYPES.services.CreateUserService)
    private readonly createUserService: CreateUserService,
    @Inject(UserType.TYPES.services.GetUserService)
    private readonly getUserService: GetUserService,
    @Inject(AuthType.TYPES.services.GetTokenAuthService)
    private readonly getTokenService: GetTokenAuthService,
    @Inject(TYPES.services.CronAzureService)
    private readonly cronAzureService: CronAzureService,
  ) {}

  async loginOrRegisterAzureToken(azureToken: string) {
    const { unique_name, email, given_name, family_name } = <AzureDecodedUser>(
      jwt_decode(azureToken)
    );
    const user = await this.getUserService.getByEmail(email ?? unique_name);
    if (user) return signIn(user, this.getTokenService, 'azure');

    const createdUser = await this.createUserService.create({
      email: email ?? unique_name,
      name: `${given_name} ${family_name}`,
    });
    if (createdUser) return signIn(createdUser, this.getTokenService, 'azure');

    return null;
  }

  getGraphQueryUrl(email: string) {
    return `https://graph.microsoft.com/v1.0/users?$search="mail:${email}" OR "displayName:${email}" OR "userPrincipalName:${email}"&$orderbydisplayName&$count=true`;
  }

  async checkUserExistsInActiveDirectory(email: string) {
    const queryUrl = this.getGraphQueryUrl(email);

    const { data } = await axios.get(queryUrl, {
      headers: {
        Authorization: `Bearer ${this.cronAzureService.getToken()}`,
        ConsistencyLevel: 'eventual',
      },
    });

    const user = data.value.find(
      (userFound: AzureUserFound) =>
        userFound.mail?.toLowerCase() === email.toLowerCase() ||
        userFound.displayName?.toLowerCase() === email.toLowerCase() ||
        userFound.userPrincipalName?.toLowerCase() === email.toLowerCase(),
    );
    return !isEmpty(user);
  }
}
