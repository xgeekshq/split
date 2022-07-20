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
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { CardGroupParams } from 'libs/dto/param/card.group.params';
import { CardItemParams } from 'libs/dto/param/card.item.params';
import { CommentGroupParams } from 'libs/dto/param/comment.group.params';
import { CommentItemParams } from 'libs/dto/param/comment.item.params';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import { SocketIdDto } from 'libs/swagger/dto/socket-id.swagger';
import { BadRequest } from 'libs/swagger/errors/bard-request.swagger';
import { InternalServerError } from 'libs/swagger/errors/internal-server-error.swagger';
import { Unauthorized } from 'libs/swagger/errors/unauthorized.swagger';
import BoardDto from 'modules/boards/dto/board.dto';
import SocketGateway from 'modules/socket/gateway/socket.gateway';

import CreateCommentDto from '../dto/create.comment.dto';
import UpdateCardCommentDto from '../dto/update.comment.dto';
import { CreateCommentApplication } from '../interfaces/applications/create.comment.application.interface';
import { DeleteCommentApplication } from '../interfaces/applications/delete.comment.application.interface';
import { UpdateCommentApplication } from '../interfaces/applications/update.comment.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Comments')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class CommentsController {
	constructor(
		@Inject(TYPES.services.CreateCommentService)
		private createCommentApp: CreateCommentApplication,
		@Inject(TYPES.services.UpdateCommentService)
		private updateCommentApp: UpdateCommentApplication,
		@Inject(TYPES.services.DeleteCommentService)
		private deleteCommentApp: DeleteCommentApplication,
		private socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Add a comment to a card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Comment added successfully!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Post(':boardId/card/:cardId/items/:itemId/comments')
	async addItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CardItemParams,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { boardId, cardId, itemId } = params;
		const { text } = createCommentDto;

		const board = await this.createCommentApp.createItemComment(
			boardId,
			cardId,
			itemId,
			request.user._id,
			text
		);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, createCommentDto.socketId);

		return board;
	}

	@ApiOperation({ summary: 'Add a comment to a card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Comment added successfully!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Post(':boardId/card/:cardId/comments')
	async addCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { boardId, cardId } = params;
		const { text, socketId } = createCommentDto;

		const board = await this.createCommentApp.createCardGroupComment(
			boardId,
			cardId,
			request.user._id,
			text
		);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Update a card item comment' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId/items/:itemId/comments/:commentId')
	async updateCardItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentItemParams,
		@Body() commentData: UpdateCardCommentDto
	) {
		const { boardId, cardId, itemId, commentId } = params;
		const { text, socketId } = commentData;

		const board = await this.updateCommentApp.updateItemComment(
			boardId,
			cardId,
			itemId,
			commentId,
			request.user._id,
			text
		);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Update a card comment' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId/comments/:commentId')
	async updateCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentGroupParams,
		@Body() commentData: UpdateCardCommentDto
	) {
		const { boardId, cardId, commentId } = params;
		const { text, socketId } = commentData;

		const board = await this.updateCommentApp.updateCardGroupComment(
			boardId,
			cardId,
			commentId,
			request.user._id,
			text
		);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Delete a card item comment' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiBody({ type: SocketIdDto, required: false })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Delete(':boardId/card/:cardId/items/:itemId/comments/:commentId')
	async deleteCardItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentItemParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, commentId } = params;
		const board = await this.deleteCommentApp.deleteItemComment(
			boardId,
			commentId,
			request.user._id
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Delete a card comment' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiBody({ type: SocketIdDto, required: false })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Delete(':boardId/card/:cardId/comments/:commentId')
	async deleteCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentGroupParams,
		@Body('socketId') socketId: string
	) {
		const { boardId, commentId } = params;

		const board = await this.deleteCommentApp.deleteCardGroupComment(
			boardId,
			commentId,
			request.user._id
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);

		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}
}
