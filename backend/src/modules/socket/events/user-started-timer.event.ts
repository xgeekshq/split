import { Logger } from '@nestjs/common';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import TimeDto from 'src/libs/dto/time.dto';

export default class UserStartedTimerEvent {
	private logger = new Logger(UserStartedTimerEvent.name);

	boardId: string;
	clientId: string;
	duration: TimeDto;

	constructor(payload: BoardTimerDurationDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.duration = payload.duration;

		this.logger.log(`${UserStartedTimerEvent.name} emitted.`);
	}
}
