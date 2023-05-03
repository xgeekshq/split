import { Body, Controller, Inject, Put, SetMetadata, UseGuards } from '@nestjs/common';
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
import { TeamRoles } from 'src/libs/enum/team.roles';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import JwtAuthenticationGuard from 'src/libs/guards/jwtAuth.guard';
import { UpdateBoardPermissionsGuard } from 'src/libs/guards/updateBoardPermissions.guard';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { ForbiddenResponse } from 'src/libs/swagger/errors/forbidden.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { UnauthorizedResponse } from 'src/libs/swagger/errors/unauthorized.swagger';
import UpdateBoardUserDto from 'src/modules/boardUsers/dto/update-board-user.dto';
import { BoardRoles } from 'src/modules/communication/dto/types';
import { BoardParticipantsPresenter } from 'src/modules/boardUsers/applications/update-board-users.use-case';
import BoardDto from 'src/modules/boards/dto/board.dto';
import { UPDATE_BOARD_USERS_USE_CASE } from '../constants';

const BoardUser = (permissions: string[]) => SetMetadata('permissions', permissions);

@ApiBearerAuth('access-token')
@ApiTags('Board Users')
@UseGuards(JwtAuthenticationGuard)
@Controller('boardUsers')
export default class BoardUsersController {
	constructor(
		@Inject(UPDATE_BOARD_USERS_USE_CASE)
		private readonly updateBoardUsersUseCase: UseCase<
			UpdateBoardUserDto,
			BoardParticipantsPresenter
		>
	) {}

	@ApiOperation({ summary: 'Update participants of a specific board' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiBody({ type: UpdateBoardUserDto })
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
	@UseGuards(UpdateBoardPermissionsGuard, BoardUserGuard)
	@Put(':boardId/participants')
	updateBoardParticipants(@Body() boardData: UpdateBoardUserDto) {
		return this.updateBoardUsersUseCase.execute(boardData);
	}
}
