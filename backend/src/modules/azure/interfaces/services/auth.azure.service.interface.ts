import { Client } from '@microsoft/microsoft-graph-client';
import { AzureUserFound } from '../../services/auth.azure.service';

export interface AuthAzureServiceInterface {
	getUserFromAzure(email: string): Promise<AzureUserFound | undefined>;

	getGraphClient(): Client;
}
