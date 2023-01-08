import { Logger } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UpdateCardPositionDto } from 'src/modules/cards/dto/update-position.card.dto';
import VoteDto from 'src/modules/votes/dto/vote.dto';
import JoinPayload from '../interfaces/joinPayload.interface';
import JoinPayloadBoards from '../interfaces/joinPayloadBoards.interface';

@WebSocketGateway({ cors: true })
export default class SocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	private logger: Logger = new Logger('AppGateway');

	sendUpdatedBoard(newBoardId: string, excludedClient: string) {
		this.server.to(newBoardId.toString()).except(excludedClient).emit('updateAllBoard', newBoardId);
	}

	sendUpdatedBoards(excludedClient: string, teamId: string) {
		this.server.to(teamId).except(excludedClient).emit('teamId');
	}

	sendUpdatedAllBoard(excludedClient: string) {
		this.server.except(excludedClient).emit('updateAllBoard');
	}

	sendUpdateCardPosition(excludedClient: string, updateCardPositionDto: UpdateCardPositionDto) {
		this.server
			.except(excludedClient)
			.emit(`${updateCardPositionDto.boardId}cardPosition`, updateCardPositionDto);
	}

	sendUpdateVotes(excludedClient: string, voteDto: VoteDto) {
		this.server.except(excludedClient).emit(`${voteDto.boardId}vote`, voteDto);
	}

	afterInit() {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	@SubscribeMessage('join')
	handleJoin(client: Socket, payload: JoinPayload) {
		client.join(payload.boardId);
	}

	@SubscribeMessage('joinBoards')
	handleJoinBoards(client: Socket, payload: JoinPayloadBoards) {
		client.join(payload.teamId);
	}
}
