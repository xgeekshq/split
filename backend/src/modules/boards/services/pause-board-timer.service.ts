import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import ServerPausedTimerEvent from 'src/modules/boards/events/server-paused-timer.event';
import PauseBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/pause-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/types';
import { BoardTimerRepositoryInterface } from 'src/modules/boards/repositories/board-timer.repository.interface';

@Injectable()
export default class PauseBoardTimerService implements PauseBoardTimerServiceInterface {
	private logger: Logger = new Logger(PauseBoardTimerService.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepositoryInterface,

		private eventEmitter: EventEmitter2
	) {}

	pauseTimer(boardTimeLeftDto: BoardTimerTimeLeftDto) {
		this.logger.log(`Will pause timer. Board: "${boardTimeLeftDto.boardId})`);

		const boardTimer = this.boardTimerRepository.findBoardTimerByBoardId(boardTimeLeftDto.boardId);

		if (!boardTimer?.timerHelper) {
			this.logger.warn(`Timer not found for board: "${boardTimeLeftDto.boardId}"`);

			return;
		}

		if (!boardTimer?.timerHelper?.isRunning) {
			this.logger.warn(`Timer not running for board: "${boardTimeLeftDto.boardId}"`);

			return;
		}

		boardTimer.timerHelper.pause();

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_PAUSED,
			new ServerPausedTimerEvent({ ...boardTimeLeftDto, ...boardTimer.timerHelper.state })
		);
	}
}
