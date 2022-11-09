import { Logger } from 'mongodb';

import { ProfileType } from 'modules/communication/dto/types';
import { CommunicationGateInterface } from 'modules/communication/interfaces/communication-gate.interface';
import { UsersHandlerInterface } from 'modules/communication/interfaces/users.handler.interface';

export class UsersSlackHandler implements UsersHandlerInterface {
	constructor(private readonly communicationGateAdapter: CommunicationGateInterface) {}

	private logger = new Logger(UsersSlackHandler.name);

	async getProfilesByIds(usersIds: string[]): Promise<ProfileType[]> {
		const profiles: ProfileType[] = [];

		// eslint-disable-next-line no-restricted-syntax
		for await (const id of usersIds) {
			const profile = await this.getProfileById(id);
			if (profile) {
				profiles.push(profile);
			}
		}
		return profiles;
	}

	private async getProfileById(userId: string): Promise<ProfileType | null> {
		try {
			const email = await this.communicationGateAdapter.getEmailByUserId(userId);

			return { id: userId, email };
		} catch (error) {
			return null;
		}
	}

	async getSlackUserIdByEmail(email: string): Promise<string> {
		return this.communicationGateAdapter.getEmailByPlatformUserId(email);
	}
}
