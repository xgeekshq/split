import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_DURATION_UPDATED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import ServerUpdatedTimerDurationEvent from 'src/modules/boards/events/server-updated-timer-duration.event';
import UpdateBoardTimerDurationServiceInterface from 'src/modules/boards/interfaces/services/update-board-timer-duration.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import { BoardTimerRepositoryInterface } from '../repositories/board-timer.repository.interface';

@Injectable()
export default class UpdateBoardTimerDurationService
	implements UpdateBoardTimerDurationServiceInterface
{
	private logger: Logger = new Logger(UpdateBoardTimerDurationService.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepositoryInterface,

		private eventEmitter: EventEmitter2
	) {}

	updateDuration(boardTimerDuration: BoardTimerDurationDto) {
		this.logger.log(`Will update timer duration. Board: "${boardTimerDuration.boardId})"`);

		const { boardId, clientId, duration } = boardTimerDuration;

		const boardTimer = this.boardTimerRepository.getOrCreateBoardTimer(boardId, clientId);

		boardTimer.timerHelper.setDuration(duration);

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_DURATION_UPDATED,
			new ServerUpdatedTimerDurationEvent({
				...boardTimerDuration,
				...boardTimer.timerHelper.duration
			})
		);
	}
}
