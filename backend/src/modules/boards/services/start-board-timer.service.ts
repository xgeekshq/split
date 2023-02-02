import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STARTED, BOARD_TIMER_SYNC_INTERVAL } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import ServerStartedTimerEvent from 'src/modules/boards/events/server-started-timer.event';
import SendBoardTimerTimeLeftService from 'src/modules/boards/interfaces/services/send-board-time-left.service.interface';
import StartBoardTimerService from 'src/modules/boards/interfaces/services/start-board-timer.service.interface';
import StopBoardTimerService from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';

@Injectable()
export default class StartBoardTimerServiceImpl implements StartBoardTimerService {
	private logger: Logger = new Logger(StartBoardTimerServiceImpl.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		@Inject(TYPES.services.StopBoardTimerService)
		private stopBoardTimerService: StopBoardTimerService,

		@Inject(TYPES.services.SendBardTimerTimeLeftService)
		private updateBoardTimerService: SendBoardTimerTimeLeftService,

		private eventEmitter: EventEmitter2
	) {}

	startTimer(boardTimerDuration: BoardTimerDurationDto) {
		this.logger.log(`Will start timer. Board: "${boardTimerDuration.boardId})"`);

		const { boardId, duration, clientId } = boardTimerDuration;
		const boardTimerFound = this.boardTimerRepository.findBoardTimerByBoardId(boardId);

		if (boardTimerFound?.timerHelper) {
			boardTimerFound.timerHelper.resume();
			this.emitTimerStartedEvent(boardTimerDuration);

			return;
		}

		const boardTimer = this.boardTimerRepository.getOrCreateBoardTimer(boardId, clientId);

		boardTimer.timerHelper.setTimerSyncIntervalAndCallback(
			BOARD_TIMER_SYNC_INTERVAL,
			(timeLeft) => {
				this.updateBoardTimerService.sendTimeLeft({ boardId, clientId, timeLeft });
			}
		);

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
