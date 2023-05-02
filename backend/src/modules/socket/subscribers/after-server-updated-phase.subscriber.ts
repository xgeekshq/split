import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import PhaseChangeEvent from '../events/user-updated-phase.event';

@Injectable()
export default class AfterServerUpdatedPhaseSubscriber {
	private logger = new Logger(AfterServerUpdatedPhaseSubscriber.name);

	constructor(private readonly socketService: SocketGateway) {}

	@OnEvent(BOARD_PHASE_SERVER_UPDATED)
	handleServerUpdatedPhaseEvent(phaseChangeEvent: PhaseChangeEvent) {
		this.logger.log(
			`Socket handling "${BOARD_PHASE_SERVER_UPDATED}". Board: "${phaseChangeEvent.boardId.toString()})"`
		);

		this.socketService.sendEvent({
			event: BOARD_PHASE_SERVER_UPDATED,
			payload: phaseChangeEvent,
			to: phaseChangeEvent.boardId.toString()
		});
	}
}
