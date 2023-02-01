import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_REQUESTED_TIMER_STATE } from 'src/libs/constants/timer';
import SendBoardTimerStateService from 'src/modules/boards/interfaces/services/send-board-timer-state.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

@Injectable()
export default class AfterUserRequestedTimerStateSubscriber {
	constructor(
		@Inject(TYPES.services.SendBoardTimerStateService)
		private readonly getBoardTimerStateService: SendBoardTimerStateService
	) {}

	@OnEvent(BOARD_TIMER_USER_REQUESTED_TIMER_STATE)
	handleUserRequestedTimerStateEvent(payload: BoardTimerDurationDto) {
		this.getBoardTimerStateService.sendBoardTimerState(payload);
	}
}
