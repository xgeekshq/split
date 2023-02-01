import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STARTED, BOARD_TIMER_SYNC_INTERVAL } from 'src/libs/constants/timer';
import ServerStartedTimerEvent from 'src/modules/boards/events/server-started-timer.event';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';
import StartBoardTimerService from '../interfaces/services/start-board-timer.service.interface';
import StopBoardTimerService from '../interfaces/services/stop-board-timer.service.interface';
import UpdateBoardTimerTimeLeftService from '../interfaces/services/update-board-time-left.service.interface';
import { TYPES } from '../interfaces/types';
import BoardTimerRepository from '../repositories/board-timer.repository';

@Injectable()
export default class StartBoardTimerServiceImpl implements StartBoardTimerService {
	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		@Inject(TYPES.services.StopBoardTimerService)
		private stopBoardTimerService: StopBoardTimerService,

		@Inject(TYPES.services.UpdateBardTimerTimeLeftService)
		private updateBoardTimerService: UpdateBoardTimerTimeLeftService,

		private eventEmitter: EventEmitter2
	) {}

	startTimer(boardTimerDuration: BoardTimerDurationDto) {
		const { boardId, duration, clientId } = boardTimerDuration;
		const boardTimerFound = this.boardTimerRepository.findBoardTimerByBoardId(boardId);

		if (boardTimerFound?.timerHelper) {
			boardTimerFound.timerHelper.resume();

			this.emitTimerStartedEvent(boardTimerDuration);

			return;
		}

		const boardTimer = this.boardTimerRepository.getOrCreateBoardTimer(boardId, clientId);

		let sync = BOARD_TIMER_SYNC_INTERVAL;
		sync = 1;
		boardTimer.timerHelper.setTimerSyncIntervalAndCallback(sync, (timeLeft) => {
			this.updateBoardTimerService.updateTimeLeft({ boardId, clientId, timeLeft });
		});

		boardTimer.timerHelper.setOnTimeExpiredCallback(() => {
			this.stopBoardTimerService.stopTimer(boardTimerDuration);
		});

		boardTimer.timerHelper.start(duration);

		this.emitTimerStartedEvent(boardTimerDuration);
	}

	private emitTimerStartedEvent(boardTimerDuration: BoardTimerDurationDto) {
		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_STARTED,
			new ServerStartedTimerEvent(boardTimerDuration)
		);
	}
}
