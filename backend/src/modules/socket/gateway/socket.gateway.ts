import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
	BOARD_TIMER_USER_DURATION_UPDATED,
	BOARD_TIMER_USER_PAUSED,
	BOARD_TIMER_USER_REQUESTED_TIMER_STATE,
	BOARD_TIMER_USER_STARTED,
	BOARD_TIMER_USER_STOPPED
} from 'src/libs/constants/timer';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';
import { hideText } from 'src/libs/utils/hideText';
import BoardGuestUserDto from 'src/modules/boardUsers/dto/board.guest.user.dto';
import Board from 'src/modules/boards/entities/board.schema';
import { CreateCardDto } from 'src/modules/cards/dto/create.card.dto';
import DeleteCardDto from 'src/modules/cards/dto/delete.card.dto';
import { MergeCardDto } from 'src/modules/cards/dto/group/merge.card.dto';
import UnmergeCardsDto from 'src/modules/cards/dto/unmerge.dto';
import { UpdateCardPositionDto } from 'src/modules/cards/dto/update-position.card.dto';
import UpdateCardDto from 'src/modules/cards/dto/update.card.dto';
import CreateCommentDto from 'src/modules/comments/dto/create.comment.dto';
import DeleteCommentDto from 'src/modules/comments/dto/delete.comment.dto';
import UpdateCardCommentDto from 'src/modules/comments/dto/update.comment.dto';
import UserPausedTimerEvent from 'src/modules/socket/events/user-paused-timer.event';
import UserRequestedTimerStateEvent from 'src/modules/socket/events/user-requested-timer-state.event';
import UserStartedTimerEvent from 'src/modules/socket/events/user-started-timer.event';
import UserStoppedTimerEvent from 'src/modules/socket/events/user-stopped-timer.event';
import UserUpdatedTimerDurationEvent from 'src/modules/socket/events/user-updated-timer-duration.event';
import JoinPayload from 'src/modules/socket/interfaces/joinPayload.interface';
import JoinPayloadBoards from 'src/modules/socket/interfaces/joinPayloadBoards.interface';
import VoteDto from 'src/modules/votes/dto/vote.dto';

type SendEventToBoardType = {
	event: string;
	to: string;
	exceptTo?: string;
	payload?: any;
};

@WebSocketGateway({ cors: true })
export default class SocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server;

	private logger: Logger = new Logger('AppGateway');

	constructor(private eventEmitter: EventEmitter2) {}

	sendEvent({ to, exceptTo, event, payload }: SendEventToBoardType) {
		this.server.to(to).except(exceptTo).emit(event, payload);
	}

	sendUpdatedBoard(newBoardId: string, excludedClient: string) {
		this.server.to(newBoardId.toString()).except(excludedClient).emit('updateAllBoard', newBoardId);
	}

	sendBoard(board: Board, excludedClient: string) {
		this.server.to(board._id.toString()).except(excludedClient).emit('board', board);
	}

	sendUpdatedBoards(excludedClient: string, teamId: string) {
		this.server.to(teamId).except(excludedClient).emit('teamId');
	}

	sendUpdatedAllBoard(boardId: string, excludedClient: string) {
		this.server.to(boardId).except(excludedClient).emit('updateAllBoard');
	}

	sendUpdateCardPosition(excludedClient: string, updateCardPositionDto: UpdateCardPositionDto) {
		this.server
			.to(updateCardPositionDto.boardId)
			.except(excludedClient)
			.emit(`${updateCardPositionDto.boardId}cardPosition`, updateCardPositionDto);
	}

	sendUpdateVotes(excludedClient: string, voteDto: VoteDto) {
		voteDto.fromRequest = false;
		voteDto.userId = hideText(voteDto.userId);
		this.server.to(voteDto.boardId).except(excludedClient).emit(`${voteDto.boardId}vote`, voteDto);
	}

	sendUnmergeCards(excludedClient: string, unmergeDto: UnmergeCardsDto) {
		this.server
			.to(unmergeDto.boardId)
			.except(excludedClient)
			.emit(`${unmergeDto.boardId}unmerge`, unmergeDto);
	}

	sendMergeCards(excludedClient: string, mergeDto: MergeCardDto) {
		this.server
			.to(mergeDto.boardId)
			.except(excludedClient)
			.emit(`${mergeDto.boardId}merge`, mergeDto);
	}

	sendAddCard(excludedClient: string, createCardDto: CreateCardDto) {
		this.server
			.to(createCardDto.boardId)
			.except(excludedClient)
			.emit(`${createCardDto.boardId}addCard`, createCardDto);
	}

	sendDeleteCard(excludedClient: string, deleteCardDto: DeleteCardDto) {
		this.server
			.to(deleteCardDto.boardId)
			.except(excludedClient)
			.emit(`${deleteCardDto.boardId}deleteCard`, deleteCardDto);
	}

	sendUpdateCard(excludedClient: string, updateCardDto: UpdateCardDto) {
		this.server
			.to(updateCardDto.boardId)
			.except(excludedClient)
			.emit(`${updateCardDto.boardId}updateCard`, updateCardDto);
	}

	sendAddComment(excludedClient: string, addCommentDto: CreateCommentDto) {
		this.server
			.to(addCommentDto.boardId)
			.except(excludedClient)
			.emit(`${addCommentDto.boardId}addComment`, addCommentDto);
	}

	sendUpdateComment(excludedClient: string, updateCommentDto: UpdateCardCommentDto) {
		this.server
			.except(excludedClient)
			.to(updateCommentDto.boardId)
			.emit(`${updateCommentDto.boardId}updateComment`, updateCommentDto);
	}

	sendDeleteComment(excludedClient: string, deleteCommentDto: DeleteCommentDto) {
		this.server
			.except(excludedClient)
			.to(deleteCommentDto.boardId)
			.emit(`${deleteCommentDto.boardId}deleteComment`, deleteCommentDto);
	}

	sendUpdateBoardUsers(boardUser: BoardGuestUserDto) {
		this.server.to(boardUser.board).emit(`${boardUser.board}updateBoardUsers`, boardUser);
	}

	@SubscribeMessage(BOARD_TIMER_USER_REQUESTED_TIMER_STATE)
	handleUserRequestedTimerStateEvent(client: Socket, payload: BoardTimerDurationDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_USER_REQUESTED_TIMER_STATE}". Client "${client.id})"`
		);

		payload.clientId = client.id;

		this.eventEmitter.emit(
			BOARD_TIMER_USER_REQUESTED_TIMER_STATE,
			new UserRequestedTimerStateEvent(payload)
		);
	}

	@SubscribeMessage(BOARD_TIMER_USER_DURATION_UPDATED)
	handleUserUpdatedTimerDurationEvent(client: Socket, payload: BoardTimerDurationDto) {
		this.logger.log(
			`Socket handling "${BOARD_TIMER_USER_DURATION_UPDATED}". Board: "${payload.boardId})"`
		);

		payload.clientId = client.id;

		this.eventEmitter.emit(
			BOARD_TIMER_USER_DURATION_UPDATED,
			new UserUpdatedTimerDurationEvent(payload)
		);
	}

	@SubscribeMessage(BOARD_TIMER_USER_STARTED)
	handleUserStartedTimerEvent(client: Socket, payload: BoardTimerDurationDto) {
		this.logger.log(`Socket handling "${BOARD_TIMER_USER_STARTED}". Board: "${payload.boardId})"`);

		payload.clientId = client.id;

		this.eventEmitter.emit(BOARD_TIMER_USER_STARTED, new UserStartedTimerEvent(payload));
	}

	@SubscribeMessage(BOARD_TIMER_USER_PAUSED)
	handleUserPausedTimerEvent(client: Socket, payload: BoardTimerTimeLeftDto) {
		this.logger.log(`Socket handling "${BOARD_TIMER_USER_PAUSED}". Board: "${payload.boardId})"`);

		payload.clientId = client.id;

		this.eventEmitter.emit(BOARD_TIMER_USER_PAUSED, new UserPausedTimerEvent(payload));
	}

	@SubscribeMessage(BOARD_TIMER_USER_STOPPED)
	handleUserStoppedTimerEvent(client: Socket, payload: BoardTimerDurationDto) {
		this.logger.log(`Socket handling "${BOARD_TIMER_USER_STOPPED}". Board: "${payload.boardId})"`);

		payload.clientId = client.id;

		this.eventEmitter.emit(BOARD_TIMER_USER_STOPPED, new UserStoppedTimerEvent(payload));
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
