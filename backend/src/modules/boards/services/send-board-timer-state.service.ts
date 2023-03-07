import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_SENT_TIMER_STATE } from 'src/libs/constants/timer';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import ServerSentTimerStateEvent from 'src/modules/boards/events/server-sent-timer-state.event';
import SendBoardTimerStateServiceInterface from 'src/modules/boards/interfaces/services/send-board-timer-state.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';

@Injectable()
export default class SendBoardTimerStateService implements SendBoardTimerStateServiceInterface {
	private logger: Logger = new Logger(SendBoardTimerStateService.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	sendBoardTimerState(boardTimerDto: BoardTimerDto) {
		this.logger.log(`Will send timer state to client "${boardTimerDto.clientId})"`);

		const boardTimer = this.boardTimerRepository.findBoardTimerByBoardId(boardTimerDto.boardId);

		let boardTimerState: BoardTimerStateDto;

		if (boardTimer?.timerHelper?.state) {
			boardTimerState = { ...boardTimerDto, ...boardTimer.timerHelper.state };
		} else {
			boardTimerState = {
				...boardTimerDto,
				status: null,
				previousStatus: null,
				duration: null,
				timeLeft: null
			};
		}

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_SENT_TIMER_STATE,
			new ServerSentTimerStateEvent(boardTimerState)
		);
	}
}
