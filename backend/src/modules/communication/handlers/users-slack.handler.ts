import { ProfileType } from 'src/modules/communication/dto/types';
import { CommunicationGateAdapterInterface } from 'src/modules/communication/interfaces/communication-gate.adapter.interface';
import { UsersHandlerInterface } from 'src/modules/communication/interfaces/users.handler.interface';

export class UsersSlackHandler implements UsersHandlerInterface {
	constructor(private readonly communicationGateAdapter: CommunicationGateAdapterInterface) {}

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
		} catch {
			return null;
		}
	}

	async getSlackUserIdByEmail(email: string): Promise<string> {
		return this.communicationGateAdapter.getEmailByPlatformUserId(email);
	}
}
