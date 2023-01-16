import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpStatus,
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
import { CardGroupParams } from 'src/libs/dto/param/card.group.params';
import { CardItemParams } from 'src/libs/dto/param/card.item.params';
import { CommentGroupParams } from 'src/libs/dto/param/comment.group.params';
import { CommentItemParams } from 'src/libs/dto/param/comment.item.params';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { SocketIdDto } from 'src/libs/swagger/dto/socket-id.swagger';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { hideText } from 'src/libs/utils/hideText';
import BoardDto from 'src/modules/boards/dto/board.dto';
import { replaceComments } from 'src/modules/boards/utils/clean-board';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { UserDocument } from 'src/modules/users/entities/user.schema';
import CreateCommentDto from '../dto/create.comment.dto';
import DeleteCommentDto from '../dto/delete.comment.dto';
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

	@ApiOperation({ summary: 'Add a new comment to a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Comment added successfully!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post(':boardId/card/:cardId/items/:itemId/comments')
	async addItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CardItemParams,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { boardId, cardId, itemId } = params;
		const { text, anonymous, socketId, columnId } = createCommentDto;

		const { newComment, hideCards } = await this.createCommentApp.createItemComment(
			boardId,
			cardId,
			itemId,
			request.user._id,
			text,
			anonymous,
			columnId
		);

		if (!newComment) throw new BadRequestException(INSERT_FAILED);

		const commentWithHiddenInfo = replaceComments(
			hideCards,
			request.user as UserDocument,
			[newComment],
			hideText(request.user._id.toString())
		);

		createCommentDto.newComment = commentWithHiddenInfo[0];

		this.socketService.sendAddComment(socketId, createCommentDto);

		return newComment;
	}

	@ApiOperation({ summary: 'Add a new comment to a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Comment added successfully!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Post(':boardId/card/:cardId/comments')
	async addCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { boardId, cardId } = params;
		const { text, socketId, anonymous, columnId } = createCommentDto;

		const { newComment, hideCards } = await this.createCommentApp.createCardGroupComment(
			boardId,
			cardId,
			request.user._id,
			text,
			anonymous,
			columnId
		);

		if (!newComment) throw new BadRequestException(INSERT_FAILED);

		const commentWithHiddenInfo = replaceComments(
			hideCards,
			request.user as UserDocument,
			[newComment],
			hideText(request.user._id.toString())
		);

		createCommentDto.newComment = commentWithHiddenInfo[0];

		this.socketService.sendAddComment(socketId, createCommentDto);

		return newComment;
	}

	@ApiOperation({ summary: 'Update a card item comment' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Comment updated successfully'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/items/:itemId/comments/:commentId')
	async updateCardItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentItemParams,
		@Body() commentData: UpdateCardCommentDto
	) {
		const { boardId, cardId, itemId, commentId } = params;
		const { text, socketId, anonymous } = commentData;

		const board = await this.updateCommentApp.updateItemComment(
			boardId,
			cardId,
			itemId,
			commentId,
			request.user._id,
			text,
			anonymous
		);

		if (!board) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		this.socketService.sendUpdateComment(socketId, commentData);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Update a card comment' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Comment updated successfully'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId/card/:cardId/comments/:commentId')
	async updateCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentGroupParams,
		@Body() commentData: UpdateCardCommentDto
	) {
		const { boardId, cardId, commentId } = params;
		const { text, socketId, anonymous } = commentData;

		const board = await this.updateCommentApp.updateCardGroupComment(
			boardId,
			cardId,
			commentId,
			request.user._id,
			text,
			anonymous
		);

		if (!board) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		this.socketService.sendUpdateComment(socketId, commentData);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Delete a comment in a card item' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiBody({ type: SocketIdDto, required: false })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Comment deleted successfully from card item.'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Delete(':boardId/card/:cardId/items/:itemId/comments/:commentId')
	async deleteCardItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentItemParams,
		@Body() commentData: DeleteCommentDto
	) {
		const { boardId, commentId } = params;

		const board = await this.deleteCommentApp.deleteItemComment(
			boardId,
			commentId,
			request.user._id.toString()
		);

		if (!board) {
			throw new BadRequestException(DELETE_FAILED);
		}

		this.socketService.sendDeleteComment(commentData.socketId, commentData);

		return HttpStatus.OK;
	}

	@ApiOperation({ summary: 'Delete a comment in a card' })
	@ApiParam({ name: 'commentId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiBody({ type: SocketIdDto, required: false })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Comment deleted successfully from card.'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Delete(':boardId/card/:cardId/comments/:commentId')
	async deleteCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentGroupParams,
		@Body() commentData: DeleteCommentDto
	) {
		const { boardId, commentId } = params;

		const board = await this.deleteCommentApp.deleteCardGroupComment(
			boardId,
			commentId,
			request.user._id.toString()
		);

		if (!board) {
			throw new BadRequestException(DELETE_FAILED);
		}

		this.socketService.sendDeleteComment(commentData.socketId, commentData);

		return HttpStatus.OK;
	}
}
