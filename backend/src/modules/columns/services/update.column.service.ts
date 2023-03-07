import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COLUMN_NOT_FOUND, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import * as Cards from 'src/modules/cards/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Columns from '../interfaces/types';
import { UpdateColumnService } from '../interfaces/services/update.column.service.interface';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ColumnDeleteCardsDto } from 'src/modules/columns/dto/colum.deleteCards.dto';
import { DeleteCardService } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { ColumnRepositoryInterface } from '../repositories/column.repository.interface';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';

@Injectable()
export default class UpdateColumnServiceImpl implements UpdateColumnService {
	constructor(
		@Inject(Columns.TYPES.repositories.ColumnRepository)
		private readonly columnRepository: ColumnRepositoryInterface,
		private socketService: SocketGateway,
		@Inject(Cards.TYPES.services.DeleteCardService)
		private deleteCardService: DeleteCardService,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	async updateColumn(boardId: string, column: UpdateColumnDto) {
		const board = await this.columnRepository.updateColumn(boardId, column);

		if (!board) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		if (column.socketId) this.socketService.sendUpdatedBoard(boardId, column.socketId);

		return board;
	}

	async deleteCardsFromColumn(boardId: string, column: ColumnDeleteCardsDto) {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		const cardsToUpdate = board.columns.find((col) => String(col._id) === column.id)?.cards;

		if (!cardsToUpdate) throw new NotFoundException(COLUMN_NOT_FOUND);

		await this.deleteCardService.deleteCardVotesFromColumn(boardId, cardsToUpdate);

		const updateBoard = await this.columnRepository.deleteCards(boardId, column.id);

		if (!updateBoard) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		if (column.socketId) {
			this.socketService.sendUpdatedBoard(boardId, column.socketId);
		}

		return updateBoard;
	}
}
