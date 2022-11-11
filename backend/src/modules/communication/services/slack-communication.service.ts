import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SLACK_MASTER_CHANNEL_ID } from 'libs/constants/slack';
import { BoardType, ChangeResponsibleType, MergeBoardType } from 'modules/communication/dto/types';
import { SlackCommunicationProducer } from 'modules/communication/producers/slack-communication.producer';
import { SlackMergeBoardProducer } from 'modules/communication/producers/slack-merge-board.producer';
import { SlackResponsibleProducer } from 'modules/communication/producers/slack-responsible.producer';

import { CommunicationServiceInterface } from '../interfaces/slack-communication.service.interface';

@Injectable()
export class SlackCommunicationService implements CommunicationServiceInterface {
	constructor(
		private configService: ConfigService,
		@Inject(SlackCommunicationProducer)
		private readonly slackCommunicationProducer: SlackCommunicationProducer,
		@Inject(SlackResponsibleProducer)
		private readonly slackResponsibleProducer: SlackResponsibleProducer,
		@Inject(SlackMergeBoardProducer)
		private readonly slackMergeBoardProducer: SlackMergeBoardProducer
	) {}

	public async execute(board: BoardType): Promise<void> {
		this.slackCommunicationProducer.add(board);
	}

	public async executeResponsibleChange(changeResponsible: ChangeResponsibleType): Promise<void> {
		changeResponsible.mainChannelId = this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID);
		this.slackResponsibleProducer.add(changeResponsible);
	}

	public async executeMergeBoardNotification(mergeBoard: MergeBoardType): Promise<void> {
		this.slackMergeBoardProducer.add(mergeBoard);
	}
}
