import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import PauseBoardTimerService from 'src/modules/boards/interfaces/services/pause-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';

@Injectable()
export default class AfterUserPausedTimerSubscriber {
	private logger: Logger = new Logger(AfterUserPausedTimerSubscriber.name);

	constructor(
		@Inject(TYPES.services.PauseBoardTimerService)
		private readonly pauseBoardTimerService: PauseBoardTimerService
	) {}

	@OnEvent(BOARD_TIMER_USER_PAUSED)
	handleUserPausedTimerEvent(payload: BoardTimerTimeLeftDto) {
		this.logger.log(`Board handling "${BOARD_TIMER_USER_PAUSED}". Board: "${payload.boardId})"`);

		this.pauseBoardTimerService.pauseTimer(payload);
	}
}
