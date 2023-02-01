import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_PAUSED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerPausedTimerSubscriber {
	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_PAUSED)
	handleServerPausedTimerEvent(payload: BoardTimerTimeLeftDto) {
		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_PAUSED,
			payload: payload.timeLeft,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
