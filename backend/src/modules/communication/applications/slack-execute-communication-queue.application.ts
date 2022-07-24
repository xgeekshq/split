import { ExecuteCommunicationAbstract } from 'modules/communication/applications/execute-communication-abstract.application';
import { BoardType, ConfigurationType } from 'modules/communication/dto/types';
import { ChatJobInterface } from 'modules/communication/interfaces/chat.job.interface';
import { ConversationsJobInterface } from 'modules/communication/interfaces/conversations.job.interface';
import { ExecuteCommunicationQueueInterface } from 'modules/communication/interfaces/execute-communication-queue.interface';
import { UsersJobInterface } from 'modules/communication/interfaces/users.job.interface';

export class SlackExecuteCommunicationQueue
	extends ExecuteCommunicationAbstract
	implements ExecuteCommunicationQueueInterface
{
	constructor(
		private readonly config: ConfigurationType,
		private readonly conversationsJob: ConversationsJobInterface,
		private readonly usersJob: UsersJobInterface,
		private readonly chatJob: ChatJobInterface
	) {
		super();
	}

	execute(board: BoardType): void {
		const teams = this.makeTeams(board, this.config.slackChannelPrefix);

		console.log(teams);
	}
}
