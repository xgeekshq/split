import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Inject,
	Param,
	Post,
	Put,
	Req,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { VoteGroupParams } from 'src/libs/dto/param/vote.group.params';
import { VoteItemParams } from 'src/libs/dto/param/vote.item.params';
import { DELETE_FAILED, INSERT_FAILED } from 'src/libs/exceptions/messages';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { SocketIdDto } from 'src/libs/swagger/dto/socket-id.swagger';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { boardVotesIdHidden } from 'src/libs/utils/boardVotesIdHidden';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import BoardDto from '../../boards/dto/board.dto';
import VoteDto from '../dto/vote.dto';
import { CreateVoteApplication } from '../interfaces/applications/create.vote.application.interface';
import { DeleteVoteApplication } from '../interfaces/applications/delete.vote.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Votes')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class VotesController {
	constructor(
		@Inject(TYPES.applications.CreateVoteApplication)
		private createVoteApp: CreateVoteApplication,
		@Inject(TYPES.applications.DeleteVoteApplication)
		private deleteVoteApp: DeleteVoteApplication,
		private socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Add a vote to a specific card item' })
	@ApiBody({
		type: SocketIdDto,
		required: false,
		description: 'If you want real time updates, you need to pass the socket id.'
	})
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Vote added successfully to a card.'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post(':boardId/card/:cardId/items/:itemId/vote')
	async addVoteToCard(
		@Req() request: RequestWithUser,
		@Param() params: VoteItemParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId, itemId } = params;
		const board = await this.createVoteApp.addVoteToCard(boardId, cardId, request.user.id, itemId);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return boardVotesIdHidden(board, request.user.id);
	}

	@ApiOperation({ summary: 'Add a vote to a specific card' })
	@ApiBody({
		type: SocketIdDto,
		required: false,
		description: 'If you want real time updates, you need to pass the socket id.'
	})
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Vote added successfully to a card item.'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post(':boardId/card/:cardId/vote')
	async addVoteToCardGroup(
		@Req() request: RequestWithUser,
		@Param() params: VoteGroupParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId } = params;
		const board = await this.createVoteApp.addVoteToCardGroup(boardId, cardId, request.user.id);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return boardVotesIdHidden(board, request.user.id);
	}

	@ApiOperation({ summary: 'Remove a vote from a specific card item' })
	@ApiBody({
		type: SocketIdDto,
		required: false,
		description: 'If you want real time updates, you need to pass the socket id.'
	})
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Vote removed successfully from card item!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Delete(':boardId/card/:cardId/items/:itemId/vote')
	async deleteVoteFromCard(
		@Req() request: RequestWithUser,
		@Param() params: VoteItemParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId, itemId } = params;
		const board = await this.deleteVoteApp.deleteVoteFromCard(
			boardId,
			cardId,
			request.user.id,
			itemId
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return boardVotesIdHidden(board, request.user.id);
	}

	@ApiOperation({ summary: 'Remove a vote from a specific card' })
	@ApiBody({
		type: SocketIdDto,
		required: false,
		description: 'If you want real time updates, you need to pass the socket id.'
	})
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Vote removed successfully from the card!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Delete(':boardId/card/:cardId/vote')
	async deleteVoteFromCardGroup(
		@Req() request: RequestWithUser,
		@Param() params: VoteGroupParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, cardId } = params;
		const board = await this.deleteVoteApp.deleteVoteFromCardGroup(
			boardId,
			cardId,
			request.user.id
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return boardVotesIdHidden(board, request.user.id);
	}

	@Put(':boardId/card/:cardId/items/:itemId/vote')
	async handleVote(
		@Req() request: RequestWithUser,
		@Param() params: VoteItemParams,
		@Body() data: VoteDto
	) {
		const { boardId, cardId, itemId } = params;

		const { count, socketId } = data;

		let board;
		for (let i = 0; i < Math.abs(count); i++) {
			if (count < 0) {
				// eslint-disable-next-line no-await-in-loop
				board = await this.deleteVoteApp.deleteVoteFromCard(
					boardId,
					cardId,
					request.user.id,
					itemId
				);
			} else {
				// eslint-disable-next-line no-await-in-loop
				board = await this.createVoteApp.addVoteToCard(boardId, cardId, request.user.id, itemId);
			}
		}

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@Put(':boardId/card/:cardId/vote')
	async handleVoteGroup(
		@Req() request: RequestWithUser,
		@Param() params: VoteGroupParams,
		@Body() data: VoteDto
	) {
		const { boardId, cardId } = params;

		const { count, socketId } = data;

		let board;
		for (let i = 0; i < Math.abs(count); i++) {
			if (count < 0) {
				// eslint-disable-next-line no-await-in-loop
				board = await this.deleteVoteApp.deleteVoteFromCardGroup(boardId, cardId, request.user.id);
			} else {
				// eslint-disable-next-line no-await-in-loop
				board = await this.createVoteApp.addVoteToCardGroup(boardId, cardId, request.user.id);
			}
		}

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}
}
