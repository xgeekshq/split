import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
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
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import { BaseParam } from 'src/libs/dto/param/base.param';
import { PaginationParams } from 'src/libs/dto/param/pagination.params';
import { BaseParamWSocket } from 'src/libs/dto/param/socket.param';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { TeamRoles } from 'src/libs/enum/team.roles';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { ForbiddenResponse } from 'src/libs/swagger/errors/forbidden.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import BoardGuestUserDto from 'src/modules/boardUsers/dto/board.guest.user.dto';
import { UpdateBoardDto } from 'src/modules/boards/dto/update-board.dto';
import { BoardResponse } from 'src/modules/boards/swagger/board.swagger';
import { BoardRoles } from 'src/modules/communication/dto/types';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { TeamParamOptional } from '../../../libs/dto/param/team.param.optional';
import { GetBoardGuard } from '../../../libs/guards/getBoardPermissions.guard';
import { DuplicateBoardDto } from '../applications/duplicate-board.use-case';
import BoardDto from '../dto/board.dto';
import CreateBoardUseCaseDto from '../dto/useCase/create-board.use-case.dto';
import GetAllBoardsUseCaseDto from '../dto/useCase/get-all-boards.use-case.dto';
import GetBoardUseCaseDto from '../dto/useCase/get-board.use-case.dto';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';
import MergeBoardUseCaseDto from '../dto/useCase/merge-board.use-case.dto';
import Board from '../entities/board.schema';
import {
	CREATE_BOARD_USE_CASE,
	DELETE_BOARD_USE_CASE,
	DUPLICATE_BOARD_USE_CASE,
	GET_ALL_BOARDS_USE_CASE,
	GET_BOARD_USE_CASE,
	GET_DASHBOARD_BOARDS_USE_CASE,
	GET_PERSONAL_BOARDS_USE_CASE,
	MERGE_BOARD_USE_CASE,
	UPDATE_BOARD_PHASE_USE_CASE,
	UPDATE_BOARD_USE_CASE
} from '../constants';
import BoardUseCasePresenter from '../presenter/board.use-case.presenter';
import DeleteBoardUseCaseDto from 'src/modules/boards/dto/useCase/delete-board.use-case';
import BoardsPaginatedPresenter from 'src/modules/boards/presenter/boards-paginated.presenter';

const BoardUser = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Boards')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class BoardsController {
	constructor(
		@Inject(GET_DASHBOARD_BOARDS_USE_CASE)
		private readonly getDashboardBoardsUseCase: UseCase<
			GetBoardsUseCaseDto,
			BoardsPaginatedPresenter
		>,
		@Inject(CREATE_BOARD_USE_CASE)
		private readonly createBoardUseCase: UseCase<CreateBoardUseCaseDto, Board>,
		@Inject(DUPLICATE_BOARD_USE_CASE)
		private readonly duplicateBoardUseCase: UseCase<DuplicateBoardDto, Board>,
		@Inject(GET_ALL_BOARDS_USE_CASE)
		private readonly getAllBoardsUseCase: UseCase<GetAllBoardsUseCaseDto, BoardsPaginatedPresenter>,
		@Inject(GET_PERSONAL_BOARDS_USE_CASE)
		private readonly getPersonalBoardsUseCase: UseCase<
			GetBoardsUseCaseDto,
			BoardsPaginatedPresenter
		>,
		@Inject(GET_BOARD_USE_CASE)
		private readonly getBoardUseCase: UseCase<GetBoardUseCaseDto, BoardUseCasePresenter>,
		@Inject(UPDATE_BOARD_USE_CASE)
		private readonly updateBoardUseCase: UseCase<UpdateBoardDto, Board>,
		@Inject(MERGE_BOARD_USE_CASE)
		private readonly mergeBoardUseCase: UseCase<MergeBoardUseCaseDto, Board>,
		@Inject(UPDATE_BOARD_PHASE_USE_CASE)
		private readonly updateBoardPhaseUseCase: UseCase<BoardPhaseDto, void>,
		@Inject(DELETE_BOARD_USE_CASE)
		private readonly deleteBoardUseCase: UseCase<DeleteBoardUseCaseDto, boolean>,
		private readonly socketService: SocketGateway
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
	createBoard(@Req() request: RequestWithUser, @Body() boardData: BoardDto) {
		return this.createBoardUseCase.execute({ userId: request.user._id, boardData });
	}

	@ApiOperation({ summary: 'Duplicate a board' })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Board duplicated successfully.'
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
	@Post('/duplicate/:boardId')
	duplicateBoard(
		@Req() request: RequestWithUser,
		@Param() { boardId }: BaseParam,
		@Body() { boardTitle }: { boardTitle: string }
	) {
		return this.duplicateBoardUseCase.execute({
			boardId,
			userId: request.user._id,
			boardTitle
		});
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
		return this.getDashboardBoardsUseCase.execute({ userId: request.user._id, page, size });
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
	getAllBoards(@Req() request: RequestWithUser, @Query() { page, size, team }: PaginationParams) {
		const { _id: userId, isSAdmin } = request.user;

		return this.getAllBoardsUseCase.execute({ team, userId, isSAdmin, page, size });
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
	getPersonalBoards(@Req() request: RequestWithUser, @Query() { page, size }: PaginationParams) {
		const { _id: userId } = request.user;

		return this.getPersonalBoardsUseCase.execute({ userId, page, size });
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
	getBoard(@Param() { boardId }: BaseParam, @Req() request: RequestWithUser) {
		const completionHandler = (boardUser: BoardGuestUserDto) => {
			this.socketService.sendUpdateBoardUsers(boardUser);
		};

		return this.getBoardUseCase.execute({ boardId, user: request.user, completionHandler });
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
		const completionHandler = () => {
			this.socketService.sendUpdatedBoard(boardId, boardData.socketId);
		};

		return this.updateBoardUseCase.execute({ ...boardData, boardId, completionHandler });
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
		const completionHandler = (deletedBoards: string[]) => {
			this.socketService.sendDeleteBoard(socketId, deletedBoards);

			if (socketId && teamId) {
				this.socketService.sendUpdatedBoard(boardId, socketId);
			}
		};

		const result = await this.deleteBoardUseCase.execute({ boardId, completionHandler });

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
	mergeBoard(
		@Param() { boardId }: BaseParam,
		@Query() { socketId }: BaseParamWSocket,
		@Req() request: RequestWithUser
	) {
		const completionHandler = () => {
			this.socketService.sendUpdatedAllBoard(boardId, socketId);
		};

		return this.mergeBoardUseCase.execute({
			subBoardId: boardId,
			userId: request.user._id,
			socketId: socketId,
			completionHandler
		});
	}

	@ApiOperation({ summary: 'Update board phase' })
	@ApiBody({
		schema: {
			properties: {
				boardId: { type: 'string' },
				phase: {
					enum: [BoardPhases.ADDCARDS, BoardPhases.VOTINGPHASE, BoardPhases.SUBMITTED],
					example: [BoardPhases.ADDCARDS, BoardPhases.VOTINGPHASE, BoardPhases.SUBMITTED]
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
	updateBoardPhase(@Body() boardPhaseDto: BoardPhaseDto) {
		return this.updateBoardPhaseUseCase.execute(boardPhaseDto);
	}
}
