import { Logger } from '@nestjs/common';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default class UserStoppedTimerEvent {
	private logger = new Logger(UserStoppedTimerEvent.name);

	boardId: string;
	clientId: string;

	constructor(payload: BoardTimerDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;

		this.logger.log(`${UserStoppedTimerEvent.name} emitted.`);
	}
}
