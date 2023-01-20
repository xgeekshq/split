import {
	ArchiveChannelData,
	ArchiveChannelDataOptions,
	ArchiveChannelResult,
	BoardType
} from 'src/modules/communication/dto/types';
import { ArchiveChannelInvalidArgError } from 'src/modules/communication/errors/archive-channel-invalid-arg.error';
import { ArchiveChannelApplicationInterface } from 'src/modules/communication/interfaces/archive-channel.application.interface';
import { ConversationsHandlerInterface } from 'src/modules/communication/interfaces/conversations.handler.interface';

export class SlackArchiveChannelApplication implements ArchiveChannelApplicationInterface {
	constructor(private readonly conversationsHandler: ConversationsHandlerInterface) {}

	public async execute(data: ArchiveChannelData): Promise<ArchiveChannelResult[]> {
		if (!this.isValid(data)) {
			throw new ArchiveChannelInvalidArgError();
		}

		if (data.type === ArchiveChannelDataOptions.CHANNEL_ID) {
			return [await this.archiveChannel(data.data)];
		}

		const board = data.data as BoardType;

		if (!data.cascade) {
			return [await this.archiveChannel(board.slackChannelId)];
		}

		return this.arquiveAllChannelsInMainBoard(board);
	}

	private async archiveChannel(channelId): Promise<ArchiveChannelResult> {
		return { channelId, result: await this.conversationsHandler.archiveChannel(channelId) };
	}

	private async arquiveAllChannelsInMainBoard(board: BoardType): Promise<ArchiveChannelResult[]> {
		const allSlackChannelIds = [board, ...board.dividedBoards]
			.filter((i) => typeof i.slackChannelId === 'string')
			.map((i) => i.slackChannelId);

		const promises = allSlackChannelIds.map((i) => this.conversationsHandler.archiveChannel(i));

		const results = await this.resolvePromises(promises);

		return allSlackChannelIds.map((channelId, idx) => ({
			channelId,
			result: results[idx]
		}));
	}

	private isValid(data: ArchiveChannelData): boolean {
		if (data.type === ArchiveChannelDataOptions.CHANNEL_ID) {
			return typeof data.data === 'string';
		}

		const board = data.data as BoardType;

		if (data.cascade) {
			return (
				data.type === ArchiveChannelDataOptions.BOARD &&
				board.id &&
				!!board.slackChannelId &&
				Array.isArray(board.dividedBoards)
			);
		}

		return data.type === ArchiveChannelDataOptions.BOARD && board.id && !!board.slackChannelId;
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
