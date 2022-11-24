import { ChangeResponsibleType } from '../dto/types';
import { ChatHandlerInterface } from '../interfaces/chat.handler.interface';
import { ConversationsHandlerInterface } from '../interfaces/conversations.handler.interface';
import { ResponsibleApplicationInterface } from '../interfaces/responsible.application.interface';
import { UsersHandlerInterface } from '../interfaces/users.handler.interface';

export class SlackResponsibleApplication implements ResponsibleApplicationInterface {
	constructor(
		private readonly chatHandler: ChatHandlerInterface,
		private readonly usersHandler: UsersHandlerInterface,
		private readonly conversationsHandler: ConversationsHandlerInterface
	) {}

	async execute(data: ChangeResponsibleType): Promise<ChangeResponsibleType | null> {
		const {
			newResponsibleEmail,
			mainChannelId,
			responsiblesChannelId,
			subTeamChannelId,
			teamNumber
		} = data;

		const newResponsibleId = await this.usersHandler.getSlackUserIdByEmail(newResponsibleEmail);

		const message = `<!channel>, <@${newResponsibleId}> is the new responsible for the team ${teamNumber}`;

		if (mainChannelId) {
			await this.chatHandler.postMessage(mainChannelId, message);
		}

		if (responsiblesChannelId) {
			await this.conversationsHandler.inviteUserToChannel(responsiblesChannelId, newResponsibleId);
			await this.chatHandler.postMessage(responsiblesChannelId, message);
		}

		await this.chatHandler.postMessage(subTeamChannelId, message);

		return data;
	}
}
