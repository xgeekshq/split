import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TYPES } from '../interfaces/types';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import Board, { BoardDocument } from 'src/modules/boards/entities/board.schema';
import * as Cards from 'src/modules/cards/interfaces/types';
import { UpdateColumnService } from '../interfaces/services/update.column.service.interface';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ColumnDeleteCardsDto } from 'src/modules/columns/dto/colum.deleteCards.dto';
import { DeleteCardService } from 'src/modules/cards/interfaces/services/delete.card.service.interface';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { ColumnRepositoryInterface } from '../repositories/column.repository.interface';

@Injectable()
export default class UpdateColumnServiceImpl implements UpdateColumnService {
	constructor(
		@Inject(TYPES.repositories.ColumnRepository)
		private readonly columnRepository: ColumnRepositoryInterface,
		@InjectModel(Board.name) private boardModel: Model<BoardDocument>,
		private socketService: SocketGateway,
		@Inject(Cards.TYPES.services.DeleteCardService)
		private deleteCardService: DeleteCardService
	) {}

	async updateColumn(boardId: string, column: UpdateColumnDto) {
		const board = await this.columnRepository.updateColumn(boardId, column);

		if (board === null) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		if (column.socketId) this.socketService.sendUpdatedBoard(boardId, column.socketId);

		return board;
	}

	async deleteCardsFromColumn(boardId: string, column: ColumnDeleteCardsDto) {
		const board = await this.boardModel.findById(boardId).exec();

		if (!board) throw new BadRequestException(UPDATE_FAILED);

		const cardsToUpdate = board.columns.find((col) => String(col._id) === column.id)?.cards;

		await this.deleteCardService.deleteCardsFromColumn(boardId, cardsToUpdate);

		const updateBoard = this.columnRepository.deleteCards(boardId, column.id);

		if (!updateBoard) throw new BadRequestException(UPDATE_FAILED);

		if (column.socketId) this.socketService.sendUpdatedBoard(boardId, column.socketId);

		return updateBoard;
	}
}
