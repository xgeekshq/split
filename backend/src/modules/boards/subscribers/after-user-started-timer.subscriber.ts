import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_STARTED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import StartBoardTimerServiceInterface from 'src/modules/boards/interfaces/services/start-board-timer.service.interface';
import { START_BOARD_TIMER_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class AfterUserStartedTimerSubscriber {
	private logger: Logger = new Logger(AfterUserStartedTimerSubscriber.name);

	constructor(
		@Inject(START_BOARD_TIMER_SERVICE)
		private readonly startBoardTimerService: StartBoardTimerServiceInterface
	) {}

	@OnEvent(BOARD_TIMER_USER_STARTED)
	handleUserStartedTimerEvent(payload: BoardTimerDurationDto) {
		this.logger.log(`Board handling "${BOARD_TIMER_USER_STARTED}". Board: "${payload.boardId})"`);

		this.startBoardTimerService.startTimer(payload);
	}
}
