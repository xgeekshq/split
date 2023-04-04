import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COLUMN_NOT_FOUND, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as Votes from 'src/modules/votes/interfaces/types';
import * as Columns from '../interfaces/types';
import { UpdateColumnServiceInterface } from '../interfaces/services/update.column.service.interface';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ColumnDeleteCardsDto } from 'src/modules/columns/dto/colum.deleteCards.dto';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { ColumnRepositoryInterface } from '../repositories/column.repository.interface';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';

@Injectable()
export default class UpdateColumnService implements UpdateColumnServiceInterface {
	constructor(
		@Inject(Columns.TYPES.repositories.ColumnRepository)
		private readonly columnRepository: ColumnRepositoryInterface,
		private socketService: SocketGateway,
		@Inject(Boards.TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface,
		@Inject(Votes.TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface
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

		await this.deleteVoteService.deleteCardVotesFromColumn(boardId, cardsToUpdate);

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
