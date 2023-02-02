import { Logger } from '@nestjs/common';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import TimeDto from 'src/libs/dto/time.dto';
import TimerStatusDto from 'src/libs/dto/timer-status.dto';

export default class ServerSentTimerStateEvent {
	private logger: Logger = new Logger(ServerSentTimerStateEvent.name);

	boardId: string;
	clientId: string;
	duration: TimeDto;
	timeLeft: TimeDto;
	status: TimerStatusDto;

	constructor(payload: BoardTimerStateDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.duration = payload.duration;
		this.timeLeft = payload.timeLeft;
		this.status = payload.status;

		this.logger.log(`${ServerSentTimerStateEvent.name} emitted.`);
	}
}
