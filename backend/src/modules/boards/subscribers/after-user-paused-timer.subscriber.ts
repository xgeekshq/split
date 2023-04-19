import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import PauseBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/pause-board-timer.service.interface';
import { PAUSE_BOARD_TIMER_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class AfterUserPausedTimerSubscriber {
	private logger: Logger = new Logger(AfterUserPausedTimerSubscriber.name);

	constructor(
		@Inject(PAUSE_BOARD_TIMER_SERVICE)
		private readonly pauseBoardTimerService: PauseBoardTimerServiceInterface
	) {}

	@OnEvent(BOARD_TIMER_USER_PAUSED)
	handleUserPausedTimerEvent(payload: BoardTimerDto) {
		this.logger.log(`Board handling "${BOARD_TIMER_USER_PAUSED}". Board: "${payload.boardId})"`);

		this.pauseBoardTimerService.pauseTimer(payload);
	}
}
