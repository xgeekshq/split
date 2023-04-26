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
import { ColumnDeleteCardsDto } from '../dto/colum.deleteCards.dto';
import { UpdateColumnApplicationInterface } from '../interfaces/applications/update.comment.application.interface';
import { UPDATE_COLUMN_APPLICATION } from 'src/modules/columns/constants';

const BoardUser = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Columns')
@UseGuards(JwtAuthenticationGuard)
@Controller('columns')
export default class ColumnsController {
	constructor(
		@Inject(UPDATE_COLUMN_APPLICATION)
		private updateColumnApp: UpdateColumnApplicationInterface
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
		return this.updateColumnApp.updateColumn(boardId, columnData);
	}

	@ApiOperation({ summary: 'Delete all cards from a column on a board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiBody({ type: ColumnDeleteCardsDto })
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
	deleteCardsFromColumn(@Param() { boardId }: BaseParam, @Body() column: ColumnDeleteCardsDto) {
		return this.updateColumnApp.deleteCardsFromColumn(boardId, column);
	}
}
