import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import UserStartedVoteEvent from '../events/user-started-vote-phase.event';

@Injectable()
export default class AfterServerUpdatedPhaseSubscriber {
	private logger = new Logger(AfterServerUpdatedPhaseSubscriber.name);

	constructor(private socketService: SocketGateway) {}

	@OnEvent(BOARD_PHASE_SERVER_UPDATED)
	handleServerUpdatedPhaseEvent(boardPhaseDto: BoardPhaseDto) {
		this.logger.log(
			`Socket handling "${BOARD_PHASE_SERVER_UPDATED}". Board: "${boardPhaseDto.boardId})"`
		);

		this.socketService.sendEvent({
			event: BOARD_PHASE_SERVER_UPDATED,
			payload: new UserStartedVoteEvent(boardPhaseDto),
			to: boardPhaseDto.boardId
		});
	}
}
