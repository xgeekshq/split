import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STOPPED } from 'src/libs/constants/timer';
import ServerStoppedTimerEvent from 'src/modules/boards/events/server-stopped-timer.event';
import StopBoardTimerService from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';
import { TYPES } from '../interfaces/types';
import BoardTimerRepository from '../repositories/board-timer.repository';

@Injectable()
export default class StopBoardTimerServiceImpl implements StopBoardTimerService {
	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	stopTimer(boardTimerDurationDto: BoardTimerDurationDto) {
		this.boardTimerRepository.removeTimer(boardTimerDurationDto.boardId);

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_STOPPED,
			new ServerStoppedTimerEvent(boardTimerDurationDto)
		);
	}
}
