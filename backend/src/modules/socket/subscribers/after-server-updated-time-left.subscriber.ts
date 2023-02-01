import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_TIME_LEFT_UPDATED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerUpdatedTimeLeftSubscriber {
	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_TIME_LEFT_UPDATED)
	handleServerUpdatedTimeLeftEvent(payload: BoardTimerTimeLeftDto) {
		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_TIME_LEFT_UPDATED,
			payload: payload.timeLeft,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
