import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_DURATION_UPDATED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerUpdatedTimerDurationSubscriber {
	private logger = new Logger(AfterServerUpdatedTimerDurationSubscriber.name);

	constructor(private readonly socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_DURATION_UPDATED)
	handleServerUpdatedTimerDurationEvent(payload: BoardTimerDurationDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_SERVER_DURATION_UPDATED}". Board: "${payload.boardId})"`
		);

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_DURATION_UPDATED,
			payload: payload.duration,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
