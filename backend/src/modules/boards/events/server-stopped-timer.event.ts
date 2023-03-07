import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import TimeDto from 'src/libs/dto/time.dto';
import TimerStatusDto from 'src/libs/dto/timer-status.dto';

export default class ServerStoppedTimerEvent {
	boardId: string;
	clientId: string;
	status: TimerStatusDto;
	duration: TimeDto;
	timeLeft: TimeDto;

	constructor(payload: BoardTimerStateDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.status = payload.status;
		this.duration = payload.duration;
		this.timeLeft = payload.timeLeft;
	}
}
