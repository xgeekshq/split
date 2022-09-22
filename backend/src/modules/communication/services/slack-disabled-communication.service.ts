import { Injectable, Logger } from '@nestjs/common';

import { BoardType } from 'modules/communication/dto/types';

@Injectable()
export class SlackDisabledCommunicationService {
	private logger = new Logger(SlackDisabledCommunicationService.name);

	public async execute(board: BoardType): Promise<void> {
		this.logger.warn(
			`Call execute method with SLACK_ENABLE "false" for board with id: "${board.id}"`
		);
	}
}
