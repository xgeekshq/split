import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_STOPPED } from 'src/libs/constants/timer';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import StopBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import { STOP_BOARD_TIMER_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class AfterUserStoppedTimerSubscriber {
	private logger: Logger = new Logger(AfterUserStoppedTimerSubscriber.name);

	constructor(
		@Inject(STOP_BOARD_TIMER_SERVICE)
		private readonly stopBoardTimerService: StopBoardTimerServiceInterface
	) {}

	@OnEvent(BOARD_TIMER_USER_STOPPED)
	handleUserStoppedTimeEvent(payload: BoardTimerDto) {
		this.logger.log(`Board handling "${BOARD_TIMER_USER_STOPPED}". Board: "${payload.boardId})"`);

		this.stopBoardTimerService.stopTimer(payload);
	}
}
