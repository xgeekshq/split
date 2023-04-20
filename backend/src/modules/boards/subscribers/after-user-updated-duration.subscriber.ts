import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_DURATION_UPDATED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import UpdateBoardTimerDurationServiceInterface from 'src/modules/boards/interfaces/services/update-board-timer-duration.service.interface';
import { UPDATE_BOARD_TIMER_DURATION_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export default class AfterUserUpdatedDurationSubscriber {
	private logger: Logger = new Logger(AfterUserUpdatedDurationSubscriber.name);

	constructor(
		@Inject(UPDATE_BOARD_TIMER_DURATION_SERVICE)
		private readonly updateBoardTimerDurationService: UpdateBoardTimerDurationServiceInterface
	) {}

	@OnEvent(BOARD_TIMER_USER_DURATION_UPDATED)
	handleUserUpdatedDurationEvent(payload: BoardTimerDurationDto) {
		this.logger.log(
			`Board handling "${BOARD_TIMER_USER_DURATION_UPDATED}". Board: "${payload.boardId})"`
		);

		this.updateBoardTimerDurationService.updateDuration(payload);
	}
}
