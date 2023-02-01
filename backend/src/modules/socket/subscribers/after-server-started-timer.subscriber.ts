import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STARTED } from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerStaredTimerSubscriber {
	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_STARTED)
	handleServerStartedTimerEvent(payload: BoardTimerDurationDto) {
		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_STARTED,
			payload: payload.duration,
			to: payload.boardId,
			exceptTo: payload.clientId
		});
	}
}
