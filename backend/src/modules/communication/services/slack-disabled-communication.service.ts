import { Injectable, Logger } from '@nestjs/common';
import {
	BoardType,
	ChangeResponsibleType,
	MergeBoardType
} from 'src/modules/communication/dto/types';
import { CommunicationServiceInterface } from 'src/modules/communication/interfaces/slack-communication.service.interface';

@Injectable()
export class SlackDisabledCommunicationService implements CommunicationServiceInterface {
	private logger = new Logger(SlackDisabledCommunicationService.name);

	public async executeResponsibleChange(
		changeResponsibleDto: ChangeResponsibleType
	): Promise<void> {
		this.logger.warn(
			`Call "executeResponsibleChange" method with SLACK_ENABLE "false" with: "${JSON.stringify(
				changeResponsibleDto
			)}"`
		);
	}

	public async executeMergeBoardNotification(mergeBoard: MergeBoardType): Promise<void> {
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
