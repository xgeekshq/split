import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_PAUSED } from 'src/libs/constants/timer';
import ServerPausedTimerEvent from 'src/modules/boards/events/server-paused-timer.event';
import PauseBoardTimerService from 'src/modules/boards/interfaces/services/pause-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';
import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';

@Injectable()
export default class PauseBoardTimerServiceImpl implements PauseBoardTimerService {
	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	pauseTimer(boardTimeLeftDto: BoardTimerTimeLeftDto) {
		const boardTimer = this.boardTimerRepository.findBoardTimerByBoardId(boardTimeLeftDto.boardId);

		if (boardTimer?.timerHelper?.isRunning) {
			boardTimer.timerHelper.pause();

			this.eventEmitter.emit(
				BOARD_TIMER_SERVER_PAUSED,
				new ServerPausedTimerEvent(boardTimeLeftDto)
			);
		}
	}
}
