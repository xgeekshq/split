import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_DURATION_UPDATED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import UpdateBoardTimerDurationServiceInterface from 'src/modules/boards/interfaces/services/update-board-timer-duration.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';

@Injectable()
export default class AfterUserUpdatedDurationSubscriber {
	private logger: Logger = new Logger(AfterUserUpdatedDurationSubscriber.name);

	constructor(
		@Inject(TYPES.services.UpdateBoardTimerDurationService)
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
