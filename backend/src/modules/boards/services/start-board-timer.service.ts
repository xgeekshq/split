import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	BOARD_TIMER_SERVER_STARTED,
	BOARD_TIMER_SYNC_INTERVAL,
	ONE_HOUR
} from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import ServerStartedTimerEvent from 'src/modules/boards/events/server-started-timer.event';
import SendBoardTimerTimeLeftServiceInterface from 'src/modules/boards/interfaces/services/send-board-time-left.service.interface';
import StartBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/start-board-timer.service.interface';
import StopBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import { BoardTimerRepositoryInterface } from 'src/modules/boards/repositories/board-timer.repository.interface';

@Injectable()
export default class StartBoardTimerService implements StartBoardTimerServiceInterface {
	private logger: Logger = new Logger(StartBoardTimerService.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepositoryInterface,

		@Inject(TYPES.services.StopBoardTimerService)
		private stopBoardTimerService: StopBoardTimerServiceInterface,

		@Inject(TYPES.services.SendBardTimerTimeLeftService)
		private updateBoardTimerService: SendBoardTimerTimeLeftServiceInterface,

		private eventEmitter: EventEmitter2
	) {}

	startTimer(boardTimerDurationDto: BoardTimerDurationDto) {
		this.logger.log(`Will start timer. Board: "${boardTimerDurationDto.boardId})"`);

		const { boardId, duration, clientId } = boardTimerDurationDto;
		const boardTimerFound = this.boardTimerRepository.findBoardTimerByBoardId(boardId);

		if (boardTimerFound?.timerHelper?.isPaused) {
			boardTimerFound.timerHelper.resume();
			this.emitTimerStartedEvent({
				...boardTimerDurationDto,
				...boardTimerFound.timerHelper.state
			});

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
			this.stopBoardTimerService.stopTimer(boardTimerDurationDto);
		});

		boardTimer.timerHelper.setCleanTimerCallback(ONE_HOUR, () => {
			this.boardTimerRepository.removeTimer(boardId);
		});

		boardTimer.timerHelper.start(duration);

		this.emitTimerStartedEvent({ ...boardTimerDurationDto, ...boardTimer.timerHelper.state });
	}

	private emitTimerStartedEvent(boardTimerDuration: BoardTimerStateDto) {
		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_STARTED,
			new ServerStartedTimerEvent(boardTimerDuration)
		);
	}
}
