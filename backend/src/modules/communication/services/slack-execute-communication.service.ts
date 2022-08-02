import { Inject, Injectable } from '@nestjs/common';

import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { TeamDto } from 'modules/communication/dto/team.dto';
import { BoardType } from 'modules/communication/dto/types';
import { ExecuteCommunicationInterface } from 'modules/communication/interfaces/execute-communication.interface';

@Injectable()
export class SlackExecuteCommunicationService {
	constructor(
		@Inject(SlackExecuteCommunication)
		private readonly application: ExecuteCommunicationInterface
	) {}

	public async execute(board: BoardType): Promise<TeamDto[]> {
		return this.application.execute(board);
	}
}
