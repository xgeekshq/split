import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_REQUESTED_TIMER_STATE } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import SendBoardTimerStateServiceInterface from 'src/modules/boards/interfaces/services/send-board-timer-state.service.interface';
import { SEND_BOARD_TIMER_STATE_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class AfterUserRequestedTimerStateSubscriber {
	private logger: Logger = new Logger(AfterUserRequestedTimerStateSubscriber.name);

	constructor(
		@Inject(SEND_BOARD_TIMER_STATE_SERVICE)
		private readonly getBoardTimerStateService: SendBoardTimerStateServiceInterface
	) {}

	@OnEvent(BOARD_TIMER_USER_REQUESTED_TIMER_STATE)
	handleUserRequestedTimerStateEvent(payload: BoardTimerDurationDto) {
		this.logger.log(
			`Board handling "${BOARD_TIMER_USER_REQUESTED_TIMER_STATE}". Client: "${payload.clientId})"`
		);

		this.getBoardTimerStateService.sendBoardTimerState(payload);
	}
}
