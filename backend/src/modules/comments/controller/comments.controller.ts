import { Body, Controller, Delete, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { SocketIdDto } from 'src/libs/swagger/dto/socket-id.swagger';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import BoardDto from 'src/modules/boards/dto/board.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import User from 'src/modules/users/entities/user.schema';
import CreateCommentDto from '../dto/create.comment.dto';
import DeleteCommentDto from '../dto/delete.comment.dto';
import UpdateCardCommentDto from '../dto/update.comment.dto';
import {
	CREATE_COMMENT_USE_CASE,
	DELETE_COMMENT_USE_CASE,
	UPDATE_COMMENT_USE_CASE
} from '../constants';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import CreateCommentUseCaseDto from 'src/modules/comments/dto/useCase/create-comment.use-case.dto';
import Comment from 'src/modules/comments/entities/comment.schema';
import DeleteCommentUseCaseDto from 'src/modules/comments/dto/useCase/delete-comment.use-case.dto';
import UpdateCommentUseCaseDto from 'src/modules/comments/dto/useCase/update-comment.use-case.dto';

@ApiBearerAuth('access-token')
@ApiTags('Comments')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class CommentsController {
	constructor(
		@Inject(CREATE_COMMENT_USE_CASE)
		private readonly createCommentUseCase: UseCase<CreateCommentUseCaseDto, Comment>,
		@Inject(DELETE_COMMENT_USE_CASE)
		private readonly deleteCommentUseCase: UseCase<DeleteCommentUseCaseDto, void>,
		@Inject(UPDATE_COMMENT_USE_CASE)
		private readonly updateCommentUseCase: UseCase<UpdateCommentUseCaseDto, void>,
		private readonly socketService: SocketGateway
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
	addItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CardItemParams,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { boardId, cardId, itemId } = params;
		const { text, anonymous, socketId, columnId } = createCommentDto;

		const completionHandler = (createCommentData: CreateCommentDto) => {
			this.socketService.sendAddComment(socketId, createCommentData);
		};

		return this.createCommentUseCase.execute({
			boardId,
			cardId,
			cardItemId: itemId,
			user: request.user as User,
			text: text,
			anonymous,
			columnId,
			socketId,
			completionHandler
		});
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
	addCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { boardId, cardId } = params;
		const { text, socketId, anonymous, columnId } = createCommentDto;

		const completionHandler = (createCommentData: CreateCommentDto) => {
			this.socketService.sendAddComment(socketId, createCommentData);
		};

		return this.createCommentUseCase.execute({
			boardId,
			cardId,
			user: request.user as User,
			text: text,
			anonymous,
			columnId,
			socketId,
			completionHandler
		});
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
	updateCardItemComment(
		@Param() params: CommentItemParams,
		@Body() commentData: UpdateCardCommentDto
	) {
		const { boardId, cardId, itemId, commentId } = params;
		const { text, socketId, anonymous, isCardGroup } = commentData;

		// const board = await this.updateCommentApp.updateItemComment(
		// 	boardId,
		// 	cardId,
		// 	itemId,
		// 	commentId,
		// 	text,
		// 	anonymous
		// );

		// if (!board) {
		// 	throw new BadRequestException(UPDATE_FAILED);
		// }

		const completionHandler = () => {
			this.socketService.sendUpdateComment(socketId, commentData);
		};

		return this.updateCommentUseCase.execute({
			boardId,
			cardId,
			cardItemId: itemId,
			isCardGroup,
			commentId,
			anonymous,
			text,
			completionHandler,
			socketId
		});
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
	updateCardGroupComment(
		@Param() params: CommentGroupParams,
		@Body() commentData: UpdateCardCommentDto
	) {
		const { boardId, cardId, commentId } = params;
		const { text, socketId, anonymous, isCardGroup } = commentData;

		// const board = await this.updateCommentApp.updateCardGroupComment(
		// 	boardId,
		// 	cardId,
		// 	commentId,
		// 	text,
		// 	anonymous
		// );

		// if (!board) {
		// 	throw new BadRequestException(UPDATE_FAILED);
		// }

		const completionHandler = () => {
			this.socketService.sendUpdateComment(socketId, commentData);
		};

		return this.updateCommentUseCase.execute({
			boardId,
			cardId,
			isCardGroup,
			commentId,
			anonymous,
			text,
			completionHandler,
			socketId
		});
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
	deleteCardItemComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentItemParams,
		@Body() commentData: DeleteCommentDto
	) {
		const { boardId, commentId } = params;

		const completionHandler = () => {
			this.socketService.sendDeleteComment(commentData.socketId, commentData);
		};

		return this.deleteCommentUseCase.execute({
			boardId,
			commentId,
			userId: String(request.user._id),
			isCardGroup: commentData.isCardGroup,
			completionHandler
		});
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
	deleteCardGroupComment(
		@Req() request: RequestWithUser,
		@Param() params: CommentGroupParams,
		@Body() commentData: DeleteCommentDto
	) {
		const { boardId, commentId } = params;

		const completionHandler = () => {
			this.socketService.sendDeleteComment(commentData.socketId, commentData);
		};

		return this.deleteCommentUseCase.execute({
			boardId,
			commentId,
			userId: String(request.user._id),
			isCardGroup: commentData.isCardGroup,
			completionHandler
		});
	}
}
