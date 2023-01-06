import { ArchiveChannelResult, BoardType } from 'src/modules/communication/dto/types';
import { ArchiveChannelInvalidArgError } from 'src/modules/communication/errors/archive-channel-invalid-arg.error';
import { ArchiveChannelApplicationInterface } from 'src/modules/communication/interfaces/archive-channel.application.interface';
import { ConversationsHandlerInterface } from 'src/modules/communication/interfaces/conversations.handler.interface';

export class SlackArchiveChannelApplication implements ArchiveChannelApplicationInterface {
	constructor(private readonly conversationsHandler: ConversationsHandlerInterface) {}

	public async execute(arg: BoardType | string, cascade = false): Promise<ArchiveChannelResult[]> {
		if (!this.isValid(arg)) {
			throw new ArchiveChannelInvalidArgError();
		}

		if (typeof arg === 'string') {
			return [await this.archiveChannel(arg)];
		}

		if (!cascade) {
			return [await this.archiveChannel(arg.slackChannelId)];
		}

		return await this.arquiveAllChannelsInMainBoard(arg);
	}

	private async archiveChannel(channelId): Promise<ArchiveChannelResult> {
		return { channelId, result: await this.conversationsHandler.archiveChannel(channelId) };
	}

	private async arquiveAllChannelsInMainBoard(board: BoardType): Promise<ArchiveChannelResult[]> {
		const boards = [board, ...board.dividedBoards].filter(
			(i) => typeof i.slackChannelId === 'string'
		);

		const promises = boards.map((i) => this.conversationsHandler.archiveChannel(i.slackChannelId));

		const results = await this.resolvePromises(promises);

		return boards.map((i, idx) => ({
			channelId: i.slackChannelId,
			result: results[idx]
		}));
	}

	private isValid(arg: BoardType | string): boolean {
		return (
			typeof arg === 'string' ||
			(!!arg.id && typeof arg.isSubBoard === 'boolean' && !!arg.slackChannelId)
		);
	}

	private async resolvePromises(promises: Promise<any>[]): Promise<any[]> {
		const results = await Promise.allSettled(promises);

		return results.map((i) => {
			if (i.status === 'rejected') {
				return typeof i.reason === 'string' ? i.reason : i.reason.message;
			}

			return i.value;
		});
	}
}
