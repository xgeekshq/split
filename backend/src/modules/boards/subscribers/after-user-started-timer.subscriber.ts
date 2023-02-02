import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_STARTED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import StartBoardTimerService from 'src/modules/boards/interfaces/services/start-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';

@Injectable()
export default class AfterUserStartedTimerSubscriber {
	private logger: Logger = new Logger(AfterUserStartedTimerSubscriber.name);

	constructor(
		@Inject(TYPES.services.StartBoardTimerService)
		private readonly startBoardTimerService: StartBoardTimerService
	) {}

	@OnEvent(BOARD_TIMER_USER_STARTED)
	handleUserStartedTimerEvent(payload: BoardTimerDurationDto) {
		this.logger.log(`Board handling "${BOARD_TIMER_USER_STARTED}". Board: "${payload.boardId})"`);

		this.startBoardTimerService.startTimer(payload);
	}
}
