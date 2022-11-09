import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SLACK_MASTER_CHANNEL_ID } from 'libs/constants/slack';
import { BoardType, ChangeResponsibleType } from 'modules/communication/dto/types';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';

import { SlackCommunicationServiceInterface } from '../interfaces/slack-communication.service.interface';
import { SlackResponsibleCommunicationProducer } from '../producers/slack-responsible-communication.producer';

@Injectable()
export class SlackCommunicationService implements SlackCommunicationServiceInterface {
	constructor(
		private configService: ConfigService,
		@Inject(SlackCommunicationProducer)
		private readonly slackCommunicationProducer: SlackCommunicationProducer,
		@Inject(SlackResponsibleCommunicationProducer)
		private readonly slackResponsibleCommunicationProducer: SlackResponsibleCommunicationProducer
	) {}

	public async execute(board: BoardType): Promise<void> {
		this.slackCommunicationProducer.add(board);
	}

	public async executeResponsibleChange(changeResponsibleDto: ChangeResponsibleType) {
		changeResponsibleDto.mainChannelId = this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID);
		this.slackResponsibleCommunicationProducer.add(changeResponsibleDto);
	}
}
