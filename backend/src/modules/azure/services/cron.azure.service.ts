import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID } from 'libs/constants/azure';

import { CronAzureService } from '../interfaces/services/cron.azure.service.interface';

@Injectable()
export default class CronAzureServiceImpl implements CronAzureService {
	constructor(private readonly configService: ConfigService) {}

	getOAuthUrl(tenantId: string) {
		return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
	}

	async getAzureAccessToken(): Promise<string> {
		const params = new URLSearchParams();
		params.append('grant_type', 'client_credentials');
		params.append('client_id', this.configService.get(AZURE_CLIENT_ID)!);
		params.append('client_secret', this.configService.get(AZURE_CLIENT_SECRET)!);
		params.append('scope', 'https://graph.microsoft.com/.default');

		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		const authUrl = this.getOAuthUrl(this.configService.get(AZURE_TENANT_ID)!);

		const { data } = await axios.post(authUrl, params, config);
		return data.access_token;
	}
}
