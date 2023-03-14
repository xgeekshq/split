import { AzureUserFound } from '../../services/auth.azure.service';

export interface AuthAzureServiceInterface {
	getUserFromAzure(email: string): Promise<AzureUserFound | undefined>;
	fetchUserPhoto(userId: string): Promise<any>;
}
