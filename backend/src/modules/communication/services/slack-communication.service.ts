import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import { BoardType } from 'modules/communication/dto/types';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';

import { ChangeResponsibleDto } from '../dto/changeResponsible.dto';

@Injectable()
export class SlackCommunicationService {
	constructor(
		private configService: ConfigService,
		@Inject(SlackCommunicationProducer)
		private readonly slackCommunicationProducer: SlackCommunicationProducer
	) {}

	public async execute(board: BoardType): Promise<void> {
		this.slackCommunicationProducer.add(board);
	}

	// criar novo producer
	public async executeResponsibleChange(changeResponsibleDto: ChangeResponsibleDto) {
		changeResponsibleDto.mainChannelId = this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID);
		this.slackCommunicationProducer.addResponsibleJob({
			changeResponsibleDto,
			config: {
				slackApiBotToken: this.configService.getOrThrow(SLACK_API_BOT_TOKEN),
				slackMasterChannelId: this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
				slackChannelPrefix: this.configService.getOrThrow(SLACK_CHANNEL_PREFIX),
				frontendUrl: this.configService.getOrThrow(FRONTEND_URL)
			}
		});
	}
}
