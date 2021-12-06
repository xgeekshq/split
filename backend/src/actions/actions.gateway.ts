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
import BoardsService from 'src/boards/boards.service';
import JoinPayload from 'src/interfaces/joinPayload.interface';
import UpdateBoardPayload from 'src/interfaces/updateBoardPayload.interface';

@WebSocketGateway({ cors: true })
export default class ActionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly boardsService: BoardsService) {}

  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('updateBoard')
  async handleMessageUpdate(client: Socket, payload: UpdateBoardPayload) {
    const result = await this.boardsService.updateBoardPatch(payload);
    if (result)
      this.server
        .to(payload.id)
        .except(client.id)
        .emit('updateBoard', payload.changes);
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
