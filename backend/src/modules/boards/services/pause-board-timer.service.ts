import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import ServerPausedTimerEvent from 'src/modules/boards/events/server-paused-timer.event';
import PauseBoardTimerService from 'src/modules/boards/interfaces/services/pause-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';

@Injectable()
export default class PauseBoardTimerServiceImpl implements PauseBoardTimerService {
	private logger: Logger = new Logger(PauseBoardTimerServiceImpl.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	pauseTimer(boardTimeLeftDto: BoardTimerTimeLeftDto) {
		this.logger.log(`Will pause timer. Board: "${boardTimeLeftDto.boardId})`);

		const boardTimer = this.boardTimerRepository.findBoardTimerByBoardId(boardTimeLeftDto.boardId);

		if (boardTimer?.timerHelper?.isRunning) {
			boardTimer.timerHelper.pause();

			this.eventEmitter.emit(
				BOARD_TIMER_SERVER_PAUSED,
				new ServerPausedTimerEvent({ ...boardTimeLeftDto, ...boardTimer.timerHelper.state })
			);
		}
	}
}
