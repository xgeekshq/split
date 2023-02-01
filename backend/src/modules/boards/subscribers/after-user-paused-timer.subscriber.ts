import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_PAUSED } from 'src/libs/constants/timer';
import PauseBoardTimerService from 'src/modules/boards/interfaces/services/pause-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';

@Injectable()
export default class AfterUserPausedTimerSubscriber {
	private logger: Logger = new Logger('AppGateway');

	constructor(
		@Inject(TYPES.services.PauseBoardTimerService)
		private readonly pauseBoardTimerService: PauseBoardTimerService
	) {}

	@OnEvent(BOARD_TIMER_USER_PAUSED)
	handleUserPausedTimerEvent(payload: BoardTimerTimeLeftDto) {
		this.pauseBoardTimerService.pauseTimer(payload);
	}
}
