import { GetBoardGuard } from './../../../libs/guards/getBoardPermissions.guard';
import { TeamRoles } from 'src/libs/enum/team.roles';
import { BoardRoles } from 'src/modules/communication/dto/types';
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
	SetMetadata,
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
import { BaseParam } from 'src/libs/dto/param/base.param';
import { PaginationParams } from 'src/libs/dto/param/pagination.params';
import { BaseParamWSocket } from 'src/libs/dto/param/socket.param';
import { BOARD_NOT_FOUND, INSERT_FAILED, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { ForbiddenResponse } from 'src/libs/swagger/errors/forbidden.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import { BoardResponse } from 'src/modules/boards/swagger/board.swagger';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { TeamParamOptional } from '../../../libs/dto/param/team.param.optional';
import BoardDto from '../dto/board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { CreateBoardApplicationInterface } from '../interfaces/applications/create.board.application.interface';
import { DeleteBoardApplicationInterface } from '../interfaces/applications/delete.board.application.interface';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { TYPES } from '../interfaces/types';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import UpdateBoardUserDto from '../dto/update-board-user.dto';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import { BoardPhases } from 'src/libs/enum/board.phases';

const BoardUser = (permissions: string[]) => SetMetadata('permissions', permissions);

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
	async getAllBoards(
		@Req() request: RequestWithUser,
		@Query() { page, size, team }: PaginationParams
	) {
		const { _id: userId, isSAdmin } = request.user;

		return this.getBoardApp.getAllBoards(team, userId, isSAdmin, page, size);
	}

	@ApiOperation({ summary: 'Retrieve personal boards from user' })
	@ApiOkResponse({ type: BoardResponse, description: 'Personal boards' })
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
	@Get('/personal')
	async getPersonalBoards(
		@Req() request: RequestWithUser,
		@Query() { page, size }: PaginationParams
	) {
		const { _id: userId } = request.user;

		return this.getBoardApp.getPersonalBoards(userId, page, size);
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
	@BoardUser([TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(GetBoardGuard)
	@Get(':boardId')
	async getBoard(@Param() { boardId }: BaseParam, @Req() request: RequestWithUser) {
		const board = await this.getBoardApp.getBoard(boardId, request.user);

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
	@BoardUser([BoardRoles.RESPONSIBLE, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(BoardUserGuard)
	@Put(':boardId')
	updateBoard(@Param() { boardId }: BaseParam, @Body() boardData: UpdateBoardDto) {
		return this.updateBoardApp.update(boardId, boardData);
	}

	@ApiOperation({ summary: 'Update participants of a specific board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiBody({ type: BoardDto })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Board participants updated successfully!'
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
	@BoardUser([BoardRoles.RESPONSIBLE, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(BoardUserGuard)
	@Put(':boardId/participants')
	updateBoardParticipants(@Body() boardData: UpdateBoardUserDto) {
		return this.updateBoardApp.updateBoardParticipants(boardData);
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
	@BoardUser([BoardRoles.RESPONSIBLE, TeamRoles.ADMIN, TeamRoles.STAKEHOLDER])
	@UseGuards(BoardUserGuard)
	@Delete(':boardId')
	async deleteBoard(
		@Param() { boardId }: BaseParam,
		@Query() { teamId }: TeamParamOptional,
		@Query() { socketId }: BaseParamWSocket
	) {
		const result = await this.deleteBoardApp.delete(boardId);

		if (socketId && teamId) {
			this.socketService.sendUpdatedBoards(socketId, teamId);
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
	async mergeBoard(
		@Param() { boardId }: BaseParam,
		@Query() { socketId }: BaseParamWSocket,
		@Req() request: RequestWithUser
	) {
		const result = await this.updateBoardApp.mergeBoards(boardId, request.user._id);

		if (!result) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		if (socketId) {
			this.socketService.sendUpdatedAllBoard(boardId, socketId);
		}

		return result;
	}

	@ApiOperation({ summary: 'Update board phase' })
	@ApiBody({
		schema: {
			properties: {
				boardId: { type: 'string' },
				phase: {
					enum: [BoardPhases.ADDCARDS, BoardPhases.VOTINGPHASE, BoardPhases.SUBMITED],
					example: [BoardPhases.ADDCARDS, BoardPhases.VOTINGPHASE, BoardPhases.SUBMITED]
				}
			}
		}
	})
	@ApiOkResponse({
		description: 'Phase successfully updated',
		type: BoardPhaseDto
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@Put(':boardId/phase')
	async updateBoardPhase(@Body() boardPhaseDto: BoardPhaseDto) {
		this.updateBoardApp.updatePhase(boardPhaseDto);
	}
}
