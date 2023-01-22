import { Inject, Injectable } from '@nestjs/common';
import { ArchiveChannelData } from 'src/modules/communication/dto/types';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { SlackArchiveChannelProducer } from 'src/modules/communication/producers/slack-archive-channel.producer';

@Injectable()
export class SlackArchiveChannelService implements ArchiveChannelServiceInterface {
	constructor(
		@Inject(SlackArchiveChannelProducer)
		private readonly slackArchiveChannelProducer: SlackArchiveChannelProducer
	) {}

	public async execute(data: ArchiveChannelData): Promise<void> {
		this.slackArchiveChannelProducer.add(data);
	}
}
