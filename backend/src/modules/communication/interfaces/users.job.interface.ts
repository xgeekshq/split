import { ProfileType } from 'modules/communication/dto/types';

export interface UsersJobInterface {
	getProfilesByIds(usersIds: string[]): Promise<ProfileType[]>;
}
