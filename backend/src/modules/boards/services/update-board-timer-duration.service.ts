import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_DURATION_UPDATED } from 'src/libs/constants/timer';
import ServerUpdatedTimerDurationEvent from 'src/modules/boards/events/server-updated-timer-duration.event';
import UpdateBoardTimerDurationService from 'src/modules/boards/interfaces/services/update-board-timer-duration.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

@Injectable()
export default class UpdateBoardTimerDurationServiceImpl
	implements UpdateBoardTimerDurationService
{
	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	updateDuration(boardTimerDurationDto: BoardTimerDurationDto) {
		const { boardId, clientId, duration } = boardTimerDurationDto;

		const boardTimer = this.boardTimerRepository.getOrCreateBoardTimer(boardId, clientId);

		boardTimer.timerHelper.setDuration(duration);

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_DURATION_UPDATED,
			new ServerUpdatedTimerDurationEvent(boardTimerDurationDto)
		);
	}
}
