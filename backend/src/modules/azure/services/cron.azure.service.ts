import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import {
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_TENANT_ID,
} from '../../../libs/constants/azure';
import { CronAzureService } from '../interfaces/services/cron.azure.service.interface';

@Injectable()
export default class CronAzureServiceImpl implements CronAzureService {
  constructor(private readonly configService: ConfigService) {
    this.getAzureAccessToken();
  }

  private azureAccessToken: string | undefined = undefined;

  @Cron('0 45 * * * *')
  async handleCron() {
    await this.getAzureAccessToken();
  }

  public getToken() {
    return this.azureAccessToken;
  }

  getOAuthUrl(tenantId: string) {
    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  }

  async getAzureAccessToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.configService.get(AZURE_CLIENT_ID)!);
    params.append(
      'client_secret',
      this.configService.get(AZURE_CLIENT_SECRET)!,
    );
    params.append('scope', 'https://graph.microsoft.com/.default');

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const authUrl = this.getOAuthUrl(this.configService.get(AZURE_TENANT_ID)!);

    const { data: tokenData } = await axios.post(authUrl, params, config);
    const { access_token: accessToken } = tokenData;
    this.azureAccessToken = accessToken;
  }
}
