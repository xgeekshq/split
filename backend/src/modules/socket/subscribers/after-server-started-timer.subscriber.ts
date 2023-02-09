import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STARTED } from 'src/libs/constants/timer';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerStaredTimerSubscriber {
	private logger = new Logger(AfterServerStaredTimerSubscriber.name);

	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_STARTED)
	handleServerStartedTimerEvent(payload: BoardTimerStateDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_SERVER_STARTED}". Board: "${payload.boardId})"`
		);

		const { boardId, clientId, ...timerState } = payload;

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_STARTED,
			payload: timerState,
			to: boardId,
			exceptTo: clientId
		});
	}
}
