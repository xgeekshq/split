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
}
