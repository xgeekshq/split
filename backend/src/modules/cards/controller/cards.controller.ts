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
import { BaseParam } from 'src/libs/dto/param/base.param';
import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';

import { BaseDto } from 'libs/dto/base.dto';
import { CardGroupParams } from 'libs/dto/param/card.group.params';
import { CardItemParams } from 'libs/dto/param/card.item.params';
import { MergeCardsParams } from 'libs/dto/param/merge.cards.params';
import { UnmergeCardsParams } from 'libs/dto/param/unmerge.cards.params';
import { DELETE_FAILED, INSERT_FAILED, UPDATE_FAILED } from 'libs/exceptions/messages';
import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';

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

	@UseGuards(JwtAuthenticationGuard)
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

	@UseGuards(JwtAuthenticationGuard)
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

	@UseGuards(JwtAuthenticationGuard)
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

	@UseGuards(JwtAuthenticationGuard)
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

	@UseGuards(JwtAuthenticationGuard)
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

	@Put(':boardId/card/:cardId/updateCardPosition')
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

	@Put(':boardId/card/:cardId/merge/:targetCardId')
	async mergeCards(@Param() params: MergeCardsParams, @Body() mergeCardsDto: BaseDto) {
		const { boardId, cardId: draggedCardId, targetCardId } = params;
		const { socketId } = mergeCardsDto;

		const board = await this.mergeCardApp.mergeCards(boardId, draggedCardId, targetCardId);

		if (!board) throw new BadRequestException(UPDATE_FAILED);
		this.socketService.sendUpdatedBoard(boardId, socketId);

		return board;
	}

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
