import { Inject, Injectable } from '@nestjs/common';

import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';
import { ExecuteCommunicationInterface } from 'modules/communication/interfaces/execute-communication.interface';
import { CommunicationProducerService } from 'queue/producers/communication.producer.service';

@Injectable()
export class SlackExecuteCommunicationService {
	constructor(
		@Inject(CommunicationProducerService)
		private readonly communicationProducerService: CommunicationProducerService,
		@Inject(SlackExecuteCommunication)
		private readonly application: ExecuteCommunicationInterface
	) {}

	public async execute(board: BoardType): Promise<TeamDto[]> {
		return this.application.execute(board);
	}

	public async executeByQueue(board: BoardType): Promise<void> {
		return this.communicationProducerService.add(board);
	}
}
