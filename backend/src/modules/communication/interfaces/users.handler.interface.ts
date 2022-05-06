import { ProfileType } from 'src/modules/communication/dto/types';

export interface UsersHandlerInterface {
  getProfilesByIds(usersIds: string[]): Promise<ProfileType[]>;
}
