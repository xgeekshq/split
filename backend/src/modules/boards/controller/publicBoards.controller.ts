import { BaseParam } from 'src/libs/dto/param/base.param';
import { BadRequestResponse } from 'src/libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'src/libs/swagger/errors/internal-server-error.swagger';
import { NotFoundResponse } from 'src/libs/swagger/errors/not-found.swagger';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiTags
} from '@nestjs/swagger';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';

@ApiTags('PublicBoards')
@Controller('publicBoards')
export default class PublicBoardsController {
	constructor(
		@Inject(TYPES.applications.IsBoardPublicUseCase)
		private isBoardPublicUseCase: UseCase<string, boolean>
	) {}

	@ApiOperation({ summary: 'Check if board is public' })
	@ApiParam({ type: String, name: 'boardId', required: true })
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
	@Get(':boardId/isPublic')
	getBoard(@Param() { boardId }: BaseParam) {
		return this.isBoardPublicUseCase.execute(boardId);
	}
}
