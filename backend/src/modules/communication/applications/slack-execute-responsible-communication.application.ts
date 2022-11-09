import { ChangeResponsibleType } from '../dto/types';
import { ChatHandlerInterface } from '../interfaces/chat.handler.interface';
import { ConversationsHandlerInterface } from '../interfaces/conversations.handler.interface';
import { ResponsibleExecuteCommunicationInterface } from '../interfaces/responsible-execute-communication.interface';
import { UsersHandlerInterface } from '../interfaces/users.handler.interface';

export class SlackResponsibleExecuteCommunication
	implements ResponsibleExecuteCommunicationInterface
{
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
			threadTimeStamp,
			teamNumber
		} = data;

		const newResponsibleId = await this.usersHandler.getSlackUserIdByEmail(newResponsibleEmail);
		// const previousResponsibleId = await this.usersHandler.getSlackUserIdByEmail(
		// 	previousResponsibleEmail
		// );

		const message = `<!channel>, <@${newResponsibleId}> is the new responsible for the team ${teamNumber}`;
		if (mainChannelId) {
			await this.chatHandler.postMessage(mainChannelId, message, threadTimeStamp);
		}

		if (responsiblesChannelId) {
			// await this.conversationsHandler.kickUserFromChannel(
			// 	previousResponsibleId,
			// 	responsiblesChannelId
			// );
			await this.conversationsHandler.inviteUserToChannel(responsiblesChannelId, newResponsibleId);
			await this.chatHandler.postMessage(responsiblesChannelId, message);
		}

		await this.chatHandler.postMessage(subTeamChannelId, message);

		return data;
	}
}
