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

type AzureUserFound = {
  mail?: string;
  displayName?: string;
  userPrincipalName?: string;
};

type AzureDecodedUser = {
  unique_name: string;
  email: string;
  given_name: string;
  family_name: string;
  name: string;
};

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
    const { unique_name, email, name, given_name, family_name } = <
      AzureDecodedUser
    >jwt_decode(azureToken);

    const splitedName = name ? name.split(' ') : [];
    const firstName = given_name ?? splitedName[0] ?? 'first';
    const lastName =
      family_name ?? splitedName[splitedName.length - 1] ?? 'last';

    const emailOrUniqueName = email ?? unique_name;

    const userExists = await this.checkUserExistsInActiveDirectory(
      emailOrUniqueName,
    );
    if (!userExists) return null;

    const user = await this.getUserService.getByEmail(emailOrUniqueName);
    if (user) return signIn(user, this.getTokenService, 'azure');

    const createdUser = await this.createUserService.create({
      email: emailOrUniqueName,
      firstName,
      lastName,
    });

    if (!createdUser) return null;

    return signIn(createdUser, this.getTokenService, 'azure');
  }

  getGraphQueryUrl(email: string) {
    return `https://graph.microsoft.com/v1.0/users?$search="mail:${email}" OR "displayName:${email}" OR "userPrincipalName:${email}"&$orderbydisplayName&$count=true`;
  }

  async checkUserExistsInActiveDirectory(email: string) {
    const queryUrl = this.getGraphQueryUrl(email);

    const { data } = await axios.get(queryUrl, {
      headers: {
        Authorization: `Bearer ${await this.cronAzureService.getAzureAccessToken()}`,
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
