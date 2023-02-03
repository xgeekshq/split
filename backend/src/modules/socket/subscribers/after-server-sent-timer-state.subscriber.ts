import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import BoardTimerStateDto from 'src/libs/dto/board-timer-state.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { BOARD_TIMER_SERVER_SENT_TIMER_STATE } from '../../../libs/constants/timer';

@Injectable()
export default class AfterServerSentTimerStateSubscriber {
	private logger = new Logger(AfterServerSentTimerStateSubscriber.name);

	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_SENT_TIMER_STATE)
	handleServerSentTimerStateEvent(payload: BoardTimerStateDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { clientId, boardId, ...timerState } = payload;

		this.logger.log(
			`Socket handling "${BOARD_TIMER_SERVER_SENT_TIMER_STATE}". Client: "${clientId})"`
		);

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_SENT_TIMER_STATE,
			payload: timerState,
			to: clientId
		});
	}
}
