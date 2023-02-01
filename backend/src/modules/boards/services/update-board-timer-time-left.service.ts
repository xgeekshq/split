import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_TIME_LEFT_UPDATED } from 'src/libs/constants/timer';
import ServerUpdatedTimeLeftEvent from 'src/modules/boards/events/server-updated-time-left.event';
import UpdateBoardTimerTimeLeftService from 'src/modules/boards/interfaces/services/update-board-time-left.service.interface';
import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';

@Injectable()
export default class UpdateBoardTimerTimeLeftServiceImpl
	implements UpdateBoardTimerTimeLeftService
{
	constructor(private eventEmitter: EventEmitter2) {}

	updateTimeLeft(boardTimeLeftDto: BoardTimerTimeLeftDto) {
		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_TIME_LEFT_UPDATED,
			new ServerUpdatedTimeLeftEvent(boardTimeLeftDto)
		);
	}
}
