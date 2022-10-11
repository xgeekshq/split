import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
	ApiUnauthorizedResponse,
	OmitType
} from '@nestjs/swagger';

import { BaseParam } from 'libs/dto/param/base.param';
import { PaginationParams } from 'libs/dto/param/pagination.params';
import {
	BOARD_NOT_FOUND,
	DELETE_FAILED,
	INSERT_FAILED,
	UPDATE_FAILED
} from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'libs/swagger/errors/bad-request.swagger';
import { ForbiddenResponse } from 'libs/swagger/errors/forbidden.swagger';
import { InternalServerErrorResponse } from 'libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'libs/swagger/errors/unauthorized.swagger';
import { BoardResponse } from 'modules/boards/swagger/board.swagger';
import SocketGateway from 'modules/socket/gateway/socket.gateway';

import BoardDto from '../dto/board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { CreateBoardApplicationInterface } from '../interfaces/applications/create.board.application.interface';
import { DeleteBoardApplicationInterface } from '../interfaces/applications/delete.board.application.interface';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Boards')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class BoardsController {
	constructor(
		@Inject(TYPES.applications.CreateBoardApplication)
		private createBoardApp: CreateBoardApplicationInterface,
		@Inject(TYPES.applications.GetBoardApplication)
		private getBoardApp: GetBoardApplicationInterface,
		@Inject(TYPES.applications.UpdateBoardApplication)
		private updateBoardApp: UpdateBoardApplicationInterface,
		@Inject(TYPES.applications.DeleteBoardApplication)
		private deleteBoardApp: DeleteBoardApplicationInterface,
		private socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Create a new board' })
	@ApiBody({
		type: OmitType(BoardDto, ['_id'] as const),
		required: true
	})
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Board created successfully.'
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
	@Post()
	async createBoard(@Req() request: RequestWithUser, @Body() boardData: BoardDto) {
		const board = await this.createBoardApp.create(boardData, request.user._id);
		if (!board) throw new BadRequestException(INSERT_FAILED);

		return board;
	}

	@ApiOperation({ summary: 'Get Boards to show on dashboard' })
	@ApiQuery({ type: Number, name: 'page' })
	@ApiQuery({ type: Number, name: 'size' })
	@ApiOkResponse({ type: BoardResponse, description: 'Boards' })
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
	@Get('/dashboard')
	getDashboardBoards(@Req() request: RequestWithUser, @Query() { page, size }: PaginationParams) {
		return this.getBoardApp.getUserBoardsOfLast3Months(request.user._id, page, size);
	}

	@ApiOperation({ summary: 'Retrieve all boards from database' })
	@ApiOkResponse({ type: BoardResponse, description: 'Boards' })
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
	@Get()
	async getAllBoards(@Req() request: RequestWithUser, @Query() { page, size }: PaginationParams) {
		const { _id: userId, isSAdmin } = request.user;
		if (isSAdmin) {
			return this.getBoardApp.getSuperAdminBoards(userId, page, size);
		}

		return this.getBoardApp.getUsersBoards(userId, page, size);
	}

	@ApiOperation({ summary: 'Retrieve one board by id' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiOkResponse({ type: BoardDto, description: 'Board retrieved successfully!' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'Board not found!'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get(':boardId')
	async getBoard(@Param() { boardId }: BaseParam, @Req() request: RequestWithUser) {
		const board = await this.getBoardApp.getBoard(boardId, request.user._id);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		return board;
	}

	@ApiOperation({ summary: 'Update a specific board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiBody({ type: BoardDto })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Board updated successfully!'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'Not found!'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
		type: ForbiddenResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Put(':boardId')
	async updateBoard(
		@Req() request: RequestWithUser,
		@Param() { boardId }: BaseParam,
		@Body() boardData: UpdateBoardDto
	) {
		const board = await this.updateBoardApp.update(request.user._id, boardId, boardData);

		if (!board) throw new BadRequestException(UPDATE_FAILED);

		if (boardData.socketId) {
			this.socketService.sendUpdatedBoard(boardId, boardData.socketId);
		}

		return board;
	}

	@ApiOperation({ summary: 'Delete a specific board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiOkResponse({ type: Boolean, description: 'Board successfully deleted!' })
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
	@Delete(':boardId')
	async deleteBoard(
		@Param() { boardId }: BaseParam,
		@Query() { socketId }: { socketId?: string },
		@Req() request: RequestWithUser
	) {
		const result = await this.deleteBoardApp.delete(boardId, request.user._id);

		if (!result) throw new BadRequestException(DELETE_FAILED);

		if (socketId) {
			console.log('dentro', socketId);
			this.socketService.sendUpdatedBoards(socketId);
			this.socketService.sendUpdatedBoard(boardId, socketId);
		}

		return result;
	}

	@ApiOperation({ summary: 'Merge sub-board into a main board' })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Board successfully merged!'
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
	@Put(':boardId/merge')
	async mergeBoard(@Param() { boardId }: BaseParam, @Req() request: RequestWithUser) {
		const result = await this.updateBoardApp.mergeBoards(boardId, request.user._id);

		if (!result) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return result;
	}
}
