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

import { CardGroupParams } from 'libs/dto/param/card.group.params';
import { CardItemParams } from 'libs/dto/param/card.item.params';
import { CommentGroupParams } from 'libs/dto/param/comment.group.params';
import { CommentItemParams } from 'libs/dto/param/comment.item.params';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import SocketGateway from 'modules/socket/gateway/socket.gateway';

import CreateCommentDto from '../dto/create.comment.dto';
import UpdateCardCommentDto from '../dto/update.comment.dto';
import { CreateCommentApplication } from '../interfaces/applications/create.comment.application.interface';
import { DeleteCommentApplication } from '../interfaces/applications/delete.comment.application.interface';
import { UpdateCommentApplication } from '../interfaces/applications/update.comment.application.interface';
import { TYPES } from '../interfaces/types';

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

	@UseGuards(JwtAuthenticationGuard)
	@Post(':boardId/card/:cardId/items/:itemId/comment')
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

	@UseGuards(JwtAuthenticationGuard)
	@Post(':boardId/card/:cardId/comment')
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

	@UseGuards(JwtAuthenticationGuard)
	@Put(':boardId/card/:cardId/items/:itemId/comment/:commentId')
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

	@UseGuards(JwtAuthenticationGuard)
	@Put(':boardId/card/:cardId/comment/:commentId')
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

	@UseGuards(JwtAuthenticationGuard)
	@Delete(':boardId/card/:cardId/items/:itemId/comment/:commentId')
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

	@UseGuards(JwtAuthenticationGuard)
	@Delete(':boardId/card/:cardId/comment/:commentId')
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
