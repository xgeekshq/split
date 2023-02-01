import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_SENT_TIMER_STATE } from 'src/libs/constants/timer';
import ServerSentTimerStateEvent from 'src/modules/boards/events/server-sent-timer-state.event';
import SendBoardTimerStateService from 'src/modules/boards/interfaces/services/send-board-timer-state.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';
import BoardTimerStateDto from 'src/modules/common/dtos/board-timer-state.dto';
import BoardTimerDto from 'src/modules/common/dtos/board-timer.dto';

@Injectable()
export default class SendBoardTimerStateServiceImpl implements SendBoardTimerStateService {
	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	sendBoardTimerState(boardTimerDto: BoardTimerDto) {
		const boardTimer = this.boardTimerRepository.findBoardTimerByBoardId(boardTimerDto.boardId);
		let boardTimerState: BoardTimerStateDto;

		if (boardTimer?.timerHelper?.state) {
			boardTimerState = { ...boardTimerDto, ...boardTimer.timerHelper.state };
		} else {
			boardTimerState = { ...boardTimerDto, status: null, duration: null, timeLeft: null };
		}

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_SENT_TIMER_STATE,
			new ServerSentTimerStateEvent(boardTimerState)
		);
	}
}
