import { Body, Controller, Inject, Param, Put, SetMetadata, UseGuards } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BaseParam } from 'src/libs/dto/param/base.param';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import BoardDto from 'src/modules/boards/dto/board.dto';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { TeamRoles } from 'src/libs/enum/team.roles';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import { ForbiddenResponse } from 'src/libs/swagger/errors/forbidden.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import ColumnDto from '../dto/column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import {
	DELETE_CARDS_FROM_COLUMN_USE_CASE,
	UPDATE_COLUMN_USE_CASE
} from 'src/modules/columns/constants';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UpdateColumnUseCaseDto } from 'src/modules/columns/dto/useCase/update-column.use-case.dto';
import Board from 'src/modules/boards/entities/board.schema';
import { DeleteCardsFromColumnDto } from 'src/modules/columns/dto/delete-cards-from-column.dto';
import { DeleteCardsFromColumnUseCaseDto } from 'src/modules/columns/dto/useCase/delete-cards-from-column.use-case.dto';

const BoardUser = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Columns')
@UseGuards(JwtAuthenticationGuard)
@Controller('columns')
export default class ColumnsController {
	constructor(
		@Inject(UPDATE_COLUMN_USE_CASE)
		private readonly updateColumnUseCase: UseCase<UpdateColumnUseCaseDto, Board>,
		@Inject(DELETE_CARDS_FROM_COLUMN_USE_CASE)
		private deleteCardsFromColumnUseCase: UseCase<DeleteCardsFromColumnUseCaseDto, Board>,
		private readonly socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Update a specific column from a board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiBody({ type: ColumnDto })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Column updated successfully!'
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
	@Put(':boardId/column/:columnId')
	updateColumn(@Param() { boardId }: BaseParam, @Body() columnData: UpdateColumnDto) {
		const completionHandler = () => {
			this.socketService.sendUpdatedBoard(boardId, columnData.socketId);
		};

		return this.updateColumnUseCase.execute({ boardId, columnData, completionHandler });
	}

	@ApiOperation({ summary: 'Delete all cards from a column on a board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiBody({ type: DeleteCardsFromColumnDto })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Cards deleted successfully!'
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
	@Put(':boardId/column/:columnId/cards')
	deleteCardsFromColumn(@Param() { boardId }: BaseParam, @Body() column: DeleteCardsFromColumnDto) {
		const completionHandler = () => {
			this.socketService.sendUpdatedBoard(boardId, column.socketId);
		};

		return this.deleteCardsFromColumnUseCase.execute({
			boardId,
			columnToDelete: column,
			completionHandler
		});
	}
}
