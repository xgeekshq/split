import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';
import { ExecuteCommunicationInterface } from 'modules/communication/interfaces/execute-communication.interface';
import { CommunicationProducerService } from 'queue/producers/communication.producer.service';

@Injectable()
export class SlackExecuteCommunicationService {
	constructor(
		private configService: ConfigService,
		@Inject(CommunicationProducerService)
		private readonly communicationProducerService: CommunicationProducerService,
		@Inject(SlackExecuteCommunication)
		private readonly application: ExecuteCommunicationInterface
	) {}

	public async execute(board: BoardType): Promise<TeamDto[]> {
		return this.application.execute(board);
	}

	public async executeByQueue(board: BoardType): Promise<void> {
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
