import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_STARTED } from 'src/libs/constants/timer';
import StartBoardTimerService from 'src/modules/boards/interfaces/services/start-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

@Injectable()
export default class AfterUserStartedTimerSubscriber {
	constructor(
		@Inject(TYPES.services.StartBoardTimerService)
		private readonly startBoardTimerService: StartBoardTimerService
	) {}

	@OnEvent(BOARD_TIMER_USER_STARTED)
	handleUserStartedTimerEvent(payload: BoardTimerDurationDto) {
		this.startBoardTimerService.startTimer(payload);
	}
}
