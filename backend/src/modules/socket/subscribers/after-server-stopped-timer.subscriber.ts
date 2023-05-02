import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STOPPED } from 'src/libs/constants/timer';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerStoppedTimerSubscriber {
	private logger = new Logger(AfterServerStoppedTimerSubscriber.name);

	constructor(private readonly socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_STOPPED)
	handleServerStoppedTimerEvent(payload: BoardTimerStateDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_SERVER_STOPPED}". Board: "${payload.boardId})"`
		);

		const { boardId, clientId, ...timerState } = payload;

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_STOPPED,
			payload: timerState,
			to: boardId,
			exceptTo: clientId
		});
	}
}
