import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerPausedTimerSubscriber {
	private logger = new Logger(AfterServerPausedTimerSubscriber.name);

	constructor(private readonly socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_PAUSED)
	handleServerPausedTimerEvent(payload: BoardTimerStateDto) {
		this.logger.log(`Socket handling "${BOARD_TIMER_SERVER_PAUSED}". Board: "${payload.boardId})"`);

		const { boardId, clientId, ...timerState } = payload;

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_PAUSED,
			payload: timerState,
			to: boardId,
			exceptTo: clientId
		});
	}
}
