import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags
} from '@nestjs/swagger';
import { BaseParam } from 'src/libs/dto/param/base.param';
import BoardDto from '../dto/board.dto';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { TYPES } from '../interfaces/types';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';

@ApiTags('Public Boards')
@Controller('publicBoards')
export default class PublicBoardsController {
	constructor(
		@Inject(TYPES.applications.GetBoardApplication)
		private getBoardApp: GetBoardApplicationInterface
	) {}

	@ApiOperation({ summary: 'Retrieve a boolean that checks if board is public' })
	@ApiParam({ type: String, name: 'boardId', required: true })
	@ApiOkResponse({ type: BoardDto, description: 'Public status retrieved successfully!' })
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiNotFoundResponse({
		type: NotFoundResponse,
		description: 'Board not found!'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get(':boardId/publicStatus')
	async getPublicStatus(@Param() { boardId }: BaseParam) {
		return await this.getBoardApp.isBoardPublic(boardId);
	}
}