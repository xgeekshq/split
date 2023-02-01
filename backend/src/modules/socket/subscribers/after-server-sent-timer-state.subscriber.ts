import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import BoardTimerStateDto from 'src/modules/common/dtos/board-timer-state.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { BOARD_TIMER_SERVER_SENT_TIMER_STATE } from '../../../libs/constants/timer';

@Injectable()
export default class AfterServerSentTimerStateSubscriber {
	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_TIMER_SERVER_SENT_TIMER_STATE)
	handleServerSentTimerStateEvent(payload: BoardTimerStateDto) {
		const { status, duration, timeLeft, clientId } = payload;

		this.socketService.sendEvent({
			event: BOARD_TIMER_SERVER_SENT_TIMER_STATE,
			payload: { status, duration, timeLeft },
			to: clientId
		});
	}
}
