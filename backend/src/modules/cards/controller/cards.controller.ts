import {
	BadRequestException,
	Body,
	Controller,
	Delete,
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
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { BaseDto } from 'libs/dto/base.dto';
import { BaseParam } from 'libs/dto/param/base.param';
import { CardGroupParams } from 'libs/dto/param/card.group.params';
import { CardItemParams } from 'libs/dto/param/card.item.params';
import { MergeCardsParams } from 'libs/dto/param/merge.cards.params';
import { UnmergeCardsParams } from 'libs/dto/param/unmerge.cards.params';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import RequestWithUser from 'libs/interfaces/requestWithUser.interface';
import { BadRequest } from 'libs/swagger/errors/bard-request.swagger';
import { InternalServerError } from 'libs/swagger/errors/internal-server-error.swagger';
import { Unauthorized } from 'libs/swagger/errors/unauthorized.swagger';
import BoardDto from 'modules/boards/dto/board.dto';

import SocketGateway from '../../socket/gateway/socket.gateway';
import { CreateCardDto } from '../dto/create.card.dto';
import DeleteCardDto from '../dto/delete.card.dto';
import UnmergeCardsDto from '../dto/unmerge.dto';
import UpdateCardDto from '../dto/update.card.dto';
import { UpdateCardPositionDto } from '../dto/update-position.card..dto';
import { CreateCardApplication } from '../interfaces/applications/create.card.application.interface';
import { DeleteCardApplication } from '../interfaces/applications/delete.card.application.interface';
import { MergeCardApplication } from '../interfaces/applications/merge.card.application.interface';
import { UnmergeCardApplication } from '../interfaces/applications/unmerge.card.application.interface';
import { UpdateCardApplication } from '../interfaces/applications/update.card.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Cards')
@UseGuards(JwtAuthenticationGuard)
@Controller('boards')
export default class CardsController {
	constructor(
		@Inject(TYPES.applications.CreateCardApplication)
		private createCardApp: CreateCardApplication,
		@Inject(TYPES.applications.UpdateCardApplication)
		private updateCardApp: UpdateCardApplication,
		@Inject(TYPES.applications.DeleteCardApplication)
		private deleteCardApp: DeleteCardApplication,
		@Inject(TYPES.applications.MergeCardApplication)
		private mergeCardApp: MergeCardApplication,
		@Inject(TYPES.applications.UnmergeCardApplication)
		private unmergeCardApp: UnmergeCardApplication,
		private socketService: SocketGateway
	) {}

	@ApiOperation({ summary: 'Create a new card' })
	@ApiParam({ name: 'boardId', type: String })
	@ApiCreatedResponse({
		type: BoardDto,
		description: 'Card successfully created!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Post(':boardId/card')
	async addCard(
		@Req() request: RequestWithUser,
		@Param() { boardId }: BaseParam,
		@Body() createCardDto: CreateCardDto
	) {
		const { card, colIdToAdd, socketId } = createCardDto;

		const board = await this.createCardApp.create(boardId, request.user._id, card, colIdToAdd);

		if (!board) throw new BadRequestException(INSERT_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Delete a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card successfully deleted!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Delete(':boardId/card/:cardId')
	async deleteCard(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() deleteCardDto: DeleteCardDto
	) {
		const { boardId, cardId } = params;
		const board = await this.deleteCardApp.delete(boardId, cardId, request.user._id);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, deleteCardDto.socketId);

		return board;
	}

	@ApiOperation({ summary: 'Delete a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card successfully delted!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Delete(':boardId/card/:cardId/items/:itemId')
	async deleteCardItem(
		@Req() request: RequestWithUser,
		@Param() params: CardItemParams,
		@Body() deleteCardDto: DeleteCardDto
	) {
		const { boardId, cardId, itemId } = params;
		const board = await this.deleteCardApp.deleteFromCardGroup(
			boardId,
			cardId,
			itemId,
			request.user._id
		);

		if (!board) throw new BadRequestException(DELETE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, deleteCardDto.socketId);

		return board;
	}

	@ApiOperation({ summary: 'Update a specific card item' })
	@ApiParam({ name: 'itemId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card item successfully updated!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId/items/:itemId')
	async updateCardText(
		@Req() request: RequestWithUser,
		@Param() params: CardItemParams,
		@Body() updateCardDto: UpdateCardDto
	) {
		const { boardId, cardId, itemId } = params;
		const { text, socketId } = updateCardDto;

		const board = await this.updateCardApp.updateCardText(
			boardId,
			cardId,
			itemId,
			request.user._id,
			text
		);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Update a specific card' })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Card successfully updated!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId')
	async updateCardGroupText(
		@Req() request: RequestWithUser,
		@Param() params: CardGroupParams,
		@Body() updateCardDto: UpdateCardDto
	) {
		const { boardId, cardId } = params;
		const { text } = updateCardDto;

		const board = await this.updateCardApp.updateCardGroupText(
			boardId,
			cardId,
			request.user._id,
			text
		);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, updateCardDto.socketId);

		return board;
	}

	@ApiOperation({
		summary: 'Change the card position',
		description:
			'This method is used to move card(s) between columns or change the position inside the actual column'
	})
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'The position of card is successfully updated!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId/update-card-position')
	async updateCardPosition(
		@Param() params: CardGroupParams,
		@Body() boardData: UpdateCardPositionDto
	) {
		const { boardId, cardId } = params;
		const { targetColumnId, newPosition, socketId } = boardData;

		const board = await this.updateCardApp.updateCardPosition(
			boardId,
			cardId,
			targetColumnId,
			newPosition
		);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Merge two cards together' })
	@ApiParam({ name: 'targetCardId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Cards are successfully merged!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId/merge/:targetCardId')
	async mergeCards(@Param() params: MergeCardsParams, @Body() mergeCardsDto: BaseDto) {
		const { boardId, cardId: draggedCardId, targetCardId } = params;
		const { socketId } = mergeCardsDto;

		const board = await this.mergeCardApp.mergeCards(boardId, draggedCardId, targetCardId);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

	@ApiOperation({ summary: 'Remove a card item from a group' })
	@ApiParam({ name: 'targetCardId', type: String })
	@ApiParam({ name: 'cardId', type: String })
	@ApiParam({ name: 'boardId', type: String })
	@ApiOkResponse({
		type: BoardDto,
		description: 'Cards are successfully unmerged!'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: Unauthorized
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequest
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerError
	})
	@Put(':boardId/card/:cardId/cardItem/:itemId/removeFromCardGroup')
	async unmergeCards(
		@Param() params: UnmergeCardsParams,
		@Body() unmergeCardsDto: UnmergeCardsDto
	) {
		const { boardId, cardId: cardGroupId, itemId: draggedCardId } = params;
		const { columnId, socketId, newPosition } = unmergeCardsDto;

		const board = await this.unmergeCardApp.unmergeAndUpdatePosition(
			boardId,
			cardGroupId,
			draggedCardId,
			columnId,
			newPosition
		);

		if (!board) throw new BadRequestException(UPDATE_FAILED);

		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}
}
