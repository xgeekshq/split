import BoardTimerDto from 'src/modules/common/dtos/board-timer.dto';

export default class UserRequestedTimerStateEvent {
	boardId: string;
	clientId: string;

	constructor(payload: BoardTimerDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
	}
}
