import { AzureUserDTO, AzureUserSyncDTO } from '../../dto/azure-user.dto';

export interface AuthAzureServiceInterface {
	getUserFromAzure(email: string): Promise<AzureUserDTO | undefined>;
	fetchUserPhoto(userId: string): Promise<any>;
	getADUsers(): Promise<Array<AzureUserSyncDTO>>;
}
