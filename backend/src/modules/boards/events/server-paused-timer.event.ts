import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';
import TimeDto from 'src/modules/common/dtos/time.dto';

export default class ServerPausedTimerEvent {
	boardId: string;
	clientId: string;
	timeLeft: TimeDto;

	constructor(payload: BoardTimerTimeLeftDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.timeLeft = payload.timeLeft;
	}
}
