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
import { hideText } from 'src/libs/utils/hideText';
import Board from 'src/modules/boards/schemas/board.schema';
import { CreateCardDto } from 'src/modules/cards/dto/create.card.dto';
import DeleteCardDto from 'src/modules/cards/dto/delete.card.dto';
import { MergeCardDto } from 'src/modules/cards/dto/group/merge.card.dto';
import UnmergeCardsDto from 'src/modules/cards/dto/unmerge.dto';
import { UpdateCardPositionDto } from 'src/modules/cards/dto/update-position.card.dto';
import UpdateCardDto from 'src/modules/cards/dto/update.card.dto';
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

	sendBoard(board: Board, excludedClient: string) {
		this.server.to(board._id.toString()).except(excludedClient).emit('board', board);
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
		voteDto.fromRequest = false;
		voteDto.userId = hideText(voteDto.userId);
		this.server.except(excludedClient).emit(`${voteDto.boardId}vote`, voteDto);
	}

	sendUnmergeCards(excludedClient: string, unmergeDto: UnmergeCardsDto) {
		this.server.except(excludedClient).emit(`${unmergeDto.boardId}unmerge`, unmergeDto);
	}

	sendMergeCards(excludedClient: string, mergeDto: MergeCardDto) {
		this.server.except(excludedClient).emit(`${mergeDto.boardId}merge`, mergeDto);
	}

	sendAddCard(excludedClient: string, createCardDto: CreateCardDto) {
		this.server.except(excludedClient).emit(`${createCardDto.boardId}addCard`, createCardDto);
	}

	sendDeleteCard(excludedClient: string, deleteCardDto: DeleteCardDto) {
		this.server.except(excludedClient).emit(`${deleteCardDto.boardId}deleteCard`, deleteCardDto);
	}

	sendUpdateCard(excludedClient: string, updateCardDto: UpdateCardDto) {
		this.server.except(excludedClient).emit(`${updateCardDto.boardId}deleteCard`, updateCardDto);
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
