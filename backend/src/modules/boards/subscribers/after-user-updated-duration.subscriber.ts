import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_USER_DURATION_UPDATED } from 'src/libs/constants/timer';
import UpdateBoardTimerDurationService from 'src/modules/boards/interfaces/services/update-board-timer-duration.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

@Injectable()
export default class AfterUserUpdatedDurationSubscriber {
	private logger: Logger = new Logger('AppGateway');

	constructor(
		@Inject(TYPES.services.UpdateBoardTimerDurationService)
		private readonly updateBoardTimerDurationService: UpdateBoardTimerDurationService
	) {}

	@OnEvent(BOARD_TIMER_USER_DURATION_UPDATED)
	handleUserUpdatedDurationEvent(payload: BoardTimerDurationDto) {
		this.updateBoardTimerDurationService.updateDuration(payload);
	}
}
