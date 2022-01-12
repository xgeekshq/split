import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import BoardsService from 'src/models/boards/boards.service';
import JoinPayload from 'src/interfaces/joinPayload.interface';
import { BoardDocument } from 'src/models/boards/schemas/board.schema';

@WebSocketGateway({ cors: true })
export default class ActionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly boardsService: BoardsService) {}

  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('AppGateway');

  sendUpdatedBoard(newBoard: BoardDocument, excludedClient: string) {
    this.server
      .to(newBoard._id.toString())
      .except(excludedClient)
      .emit('updateAllBoard', newBoard);
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
