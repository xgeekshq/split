import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_TIME_LEFT_UPDATED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import ServerUpdatedTimeLeftEvent from 'src/modules/boards/events/server-updated-time-left.event';
import UpdateBoardTimerTimeLeftService from 'src/modules/boards/interfaces/services/update-board-time-left.service.interface';

@Injectable()
export default class SendBoardTimerTimeLeftServiceImpl implements UpdateBoardTimerTimeLeftService {
	private logger: Logger = new Logger(SendBoardTimerTimeLeftServiceImpl.name);
	constructor(private eventEmitter: EventEmitter2) {}

	sendTimeLeft(boardTimeLeft: BoardTimerTimeLeftDto) {
		this.logger.log(`Will send time left. Board: "${boardTimeLeft.boardId})"`);
		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_TIME_LEFT_UPDATED,
			new ServerUpdatedTimeLeftEvent(boardTimeLeft)
		);
	}
}
