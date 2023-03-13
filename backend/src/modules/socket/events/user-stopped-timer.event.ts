import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default class UserStoppedTimerEvent {
	boardId: string;
	clientId: string;

	constructor(payload: BoardTimerDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
	}
}
