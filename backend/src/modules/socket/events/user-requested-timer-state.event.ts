import { Logger } from '@nestjs/common';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default class UserRequestedTimerStateEvent {
	private logger = new Logger(UserRequestedTimerStateEvent.name);

	boardId: string;
	clientId: string;

	constructor(payload: BoardTimerDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;

		this.logger.log(`${UserRequestedTimerStateEvent.name} emitted.`);
	}
}
