import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_STOPPED } from 'src/libs/constants/timer';
import StopBoardTimerService from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

@Injectable()
export default class AfterUserStoppedTimerSubscriber {
	constructor(
		@Inject(TYPES.services.StopBoardTimerService)
		private readonly stopBoardTimerService: StopBoardTimerService
	) {}

	@OnEvent(BOARD_TIMER_USER_STOPPED)
	handleUserStoppedTimeEvent(payload: BoardTimerDurationDto) {
		this.stopBoardTimerService.stopTimer(payload);
	}
}
