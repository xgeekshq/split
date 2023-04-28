import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_TIME_LEFT_UPDATED } from 'src/libs/constants/timer';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerUpdatedTimeLeftSubscriber {
	private logger = new Logger(AfterServerUpdatedTimeLeftSubscriber.name);

	constructor(private readonly socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_TIME_LEFT_UPDATED)
	handleServerUpdatedTimeLeftEvent(payload: BoardTimerTimeLeftDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_SERVER_TIME_LEFT_UPDATED}". Board: "${payload.boardId})"`
		);

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_TIME_LEFT_UPDATED,
			payload: payload.timeLeft,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
