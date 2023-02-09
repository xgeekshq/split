import { Logger } from '@nestjs/common';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import TimeDto from 'src/libs/dto/time.dto';

export default class ServerUpdatedTimeLeftEvent {
	private logger: Logger = new Logger(ServerUpdatedTimeLeftEvent.name);

	boardId: string;
	clientId: string;
	timeLeft: TimeDto;

	constructor(payload: BoardTimerTimeLeftDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.timeLeft = payload.timeLeft;

		this.logger.log(`${ServerUpdatedTimeLeftEvent.name} emitted.`);
	}
}
