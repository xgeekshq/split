import { Injectable, Logger } from '@nestjs/common';

import {
	BoardType,
	ChangeResponsibleType,
	MergeBoardCommunicationType
} from 'modules/communication/dto/types';
import { SlackCommunicationServiceInterface } from 'modules/communication/interfaces/slack-communication.service.interface';

@Injectable()
export class SlackDisabledCommunicationService implements SlackCommunicationServiceInterface {
	private logger = new Logger(SlackDisabledCommunicationService.name);

	public async executeResponsibleChange(changeResponsibleDto: ChangeResponsibleType) {
		this.logger.warn(
			`Call "executeResponsibleChange" method with SLACK_ENABLE "false" with: "${JSON.stringify(
				changeResponsibleDto
			)}"`
		);
	}

	public async executeMergeBoardNotification(mergeBoard: MergeBoardCommunicationType) {
		this.logger.warn(
			`Call "executeMergeBoardNotification" method with SLACK_ENABLE "false" with: "${JSON.stringify(
				mergeBoard
			)}"`
		);
	}

	public async execute(board: BoardType): Promise<void> {
		this.logger.warn(
			`Call execute method with SLACK_ENABLE "false" for board with id: "${board.id}"`
		);
	}
}
