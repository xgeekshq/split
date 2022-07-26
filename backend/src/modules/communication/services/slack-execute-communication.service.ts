import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import { BoardType } from 'modules/communication/dto/types';
import { CommunicationProducerService } from 'modules/communication/producers/producer.service';

@Injectable()
export class SlackExecuteCommunicationService {
	constructor(
		private configService: ConfigService,
		@Inject(CommunicationProducerService)
		private readonly communicationProducerService: CommunicationProducerService
	) {}

	public async execute(board: BoardType): Promise<void> {
		this.communicationProducerService.add({
			board,
			config: {
				slackApiBotToken: this.configService.getOrThrow(SLACK_API_BOT_TOKEN),
				slackMasterChannelId: this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
				slackChannelPrefix: this.configService.getOrThrow(SLACK_CHANNEL_PREFIX),
				frontendUrl: this.configService.getOrThrow(FRONTEND_URL)
			}
		});
	}
}
