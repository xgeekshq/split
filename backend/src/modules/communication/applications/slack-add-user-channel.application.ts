import { Logger } from '@nestjs/common';
import { ConfigurationType } from 'src/modules/communication/dto/types';
import { ConversationsHandlerInterface } from 'src/modules/communication/interfaces/conversations.handler.interface';
import { UsersHandlerInterface } from 'src/modules/communication/interfaces/users.handler.interface';
import { AddUserIntoChannelApplicationInterface } from '../interfaces/communication.application.interface copy';

export class SlackAddUserIntoChannelApplication implements AddUserIntoChannelApplicationInterface {
	private logger = new Logger(SlackAddUserIntoChannelApplication.name);

	constructor(
		private readonly config: ConfigurationType,
		private readonly conversationsHandler: ConversationsHandlerInterface,
		private readonly usersHandler: UsersHandlerInterface
	) {}

	public execute(email: string): Promise<boolean> {
		return this.inviteMemberToMainChannel(email);
	}

	private async inviteMemberToMainChannel(email: string): Promise<boolean> {
		try {
			const userId = await this.usersHandler.getSlackUserIdByEmail(email);
			await this.conversationsHandler.inviteUserToChannel(this.config.slackMasterChannelId, userId);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			return false;
		}

		return true;
	}
}
