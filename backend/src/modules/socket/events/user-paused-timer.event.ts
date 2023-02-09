import { Logger } from '@nestjs/common';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import TimeDto from 'src/libs/dto/time.dto';

export default class UserPausedTimerEvent {
	private logger = new Logger(UserPausedTimerEvent.name);

	boardId: string;
	clientId: string;
	timeLeft: TimeDto;

	constructor(payload: BoardTimerTimeLeftDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.timeLeft = payload.timeLeft;

		this.logger.log(`${UserPausedTimerEvent.name} emitted.`);
	}
}
