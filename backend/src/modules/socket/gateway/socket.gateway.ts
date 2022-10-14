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

import JoinPayload from '../interfaces/joinPayload.interface';
import JoinPayloadBoards from '../interfaces/joinPayloadBoards.interface';

@WebSocketGateway({ cors: true })
export default class SocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	private logger: Logger = new Logger('AppGateway');

	sendUpdatedBoards(excludedClient: string, teamId: string) {
		this.server.to(teamId).except(excludedClient).emit('updateBoardList');
	}

	sendUpdatedBoard(newBoardId: string, excludedClient: string) {
		this.server.to(newBoardId.toString()).except(excludedClient).emit('updateAllBoard', newBoardId);
	}

	sendUpdatedBoards(excludedClient: string) {
		this.server.except(excludedClient).emit('updateBoardList');
	}

	sendUpdatedAllBoard(excludedClient: string) {
		this.server.except(excludedClient).emit('updateAllBoard');
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

	@SubscribeMessage('joinBoards')
	handleJoinBoards(client: Socket, payload: JoinPayloadBoards) {
		client.join(payload.boards);
	}

	@SubscribeMessage('joinBoards')
	handleJoinBoards(client: Socket, payload: JoinPayloadBoards) {
		client.join(payload.teamId);
	}
}
