import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default class UserRequestedTimerStateEvent {
	boardId: string;
	clientId: string;

	constructor(payload: BoardTimerDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
	}
}
