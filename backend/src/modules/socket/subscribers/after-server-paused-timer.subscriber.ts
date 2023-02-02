import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerPausedTimerSubscriber {
	private logger = new Logger(AfterServerPausedTimerSubscriber.name);

	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_PAUSED)
	handleServerPausedTimerEvent(payload: BoardTimerTimeLeftDto) {
		this.logger.log(`Socket handling "${BOARD_TIMER_SERVER_PAUSED}". Board: "${payload.boardId})"`);

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_PAUSED,
			payload: payload.timeLeft,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
