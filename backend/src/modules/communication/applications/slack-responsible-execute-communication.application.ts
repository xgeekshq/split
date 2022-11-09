import { ChangeResponsibleDto } from '../dto/changeResponsible.dto';
import { ChatHandlerInterface } from '../interfaces/chat.handler.interface';
import { ResponsibleExecuteCommunicationInterface } from '../interfaces/responsible-execute-communication.interface';
import { UsersHandlerInterface } from '../interfaces/users.handler.interface';

export class SlackResponsibleExecuteCommunication
	implements ResponsibleExecuteCommunicationInterface
{
	constructor(
		private readonly chatHandler: ChatHandlerInterface,
		private readonly usersHandler: UsersHandlerInterface
	) {}

	async execute(data: ChangeResponsibleDto): Promise<void> {
		const { email, mainChannelId, subTeamChannelId, threadTimeStamp, userId, teamNumber } = data;

		if (!email) return;
		data.userId = await this.usersHandler.getSlackUserIdByEmail(email);

		if (!userId) return;

		const message = `The <@${userId}> is the new responsible for team ${teamNumber}`;

		this.chatHandler.postMessage(subTeamChannelId, message, mainChannelId, threadTimeStamp);
	}
}
