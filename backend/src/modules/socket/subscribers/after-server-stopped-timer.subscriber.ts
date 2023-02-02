import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STOPPED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerStoppedTimerSubscriber {
	private logger = new Logger(AfterServerStoppedTimerSubscriber.name);

	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_STOPPED)
	handleServerStoppedTimerEvent(payload: BoardTimerDurationDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_SERVER_STOPPED}". Board: "${payload.boardId})"`
		);

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_STOPPED,
			payload: payload.duration,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
