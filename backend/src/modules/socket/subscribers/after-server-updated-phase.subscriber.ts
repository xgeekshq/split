import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

@Injectable()
export default class AfterServerUpdatedPhaseSubscriber {
	private logger = new Logger(AfterServerUpdatedPhaseSubscriber.name);

	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_PHASE_SERVER_UPDATED)
	handleServerUpdatedPhaseEvent(boardChangeEvent) {
		const { board } = boardChangeEvent;
		this.logger.log(
			`Socket handling "${BOARD_PHASE_SERVER_UPDATED}". Board: "${board._id.toString()})"`
		);

		this.socketService.sendEvent({
			event: BOARD_PHASE_SERVER_UPDATED,
			payload: boardChangeEvent,
			to: board._id.toString()
		});
	}
}
