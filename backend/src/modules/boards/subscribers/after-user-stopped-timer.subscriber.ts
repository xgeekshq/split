import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_STOPPED } from 'src/libs/constants/timer';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import StopBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/types';

@Injectable()
export default class AfterUserStoppedTimerSubscriber {
	private logger: Logger = new Logger(AfterUserStoppedTimerSubscriber.name);

	constructor(
		@Inject(TYPES.services.StopBoardTimerService)
		private readonly stopBoardTimerService: StopBoardTimerServiceInterface
	) {}

	@OnEvent(BOARD_TIMER_USER_STOPPED)
	handleUserStoppedTimeEvent(payload: BoardTimerDto) {
		this.logger.log(`Board handling "${BOARD_TIMER_USER_STOPPED}". Board: "${payload.boardId})"`);

		this.stopBoardTimerService.stopTimer(payload);
	}
}
