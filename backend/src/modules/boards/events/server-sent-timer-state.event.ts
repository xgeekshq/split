import { BoardTimerStateDto } from 'src/modules/common/dtos/board-timer-state.dto';
import TimeDto from 'src/modules/common/dtos/time.dto';
import TimerStatusDto from 'src/modules/common/dtos/timer-status.dto';

export default class ServerSentTimerStateEvent {
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
	}
}
