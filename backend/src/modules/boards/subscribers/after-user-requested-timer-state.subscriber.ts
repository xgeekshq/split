import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_REQUESTED_TIMER_STATE } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import SendBoardTimerStateService from 'src/modules/boards/interfaces/services/send-board-timer-state.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';

@Injectable()
export default class AfterUserRequestedTimerStateSubscriber {
	private logger: Logger = new Logger(AfterUserRequestedTimerStateSubscriber.name);

	constructor(
		@Inject(TYPES.services.SendBoardTimerStateService)
		private readonly getBoardTimerStateService: SendBoardTimerStateService
	) {}

	@OnEvent(BOARD_TIMER_USER_REQUESTED_TIMER_STATE)
	handleUserRequestedTimerStateEvent(payload: BoardTimerDurationDto) {
		this.logger.log(
			`Board handling "${BOARD_TIMER_USER_REQUESTED_TIMER_STATE}". Client: "${payload.clientId})"`
		);

		this.getBoardTimerStateService.sendBoardTimerState(payload);
	}
}
