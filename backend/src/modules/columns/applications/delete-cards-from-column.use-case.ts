import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COLUMN_NOT_FOUND, UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { GET_BOARD_SERVICE } from 'src/modules/boards/constants';
import Board from 'src/modules/boards/entities/board.schema';
import { GetBoardServiceInterface } from 'src/modules/boards/interfaces/services/get.board.service.interface';
import { COLUMN_REPOSITORY } from 'src/modules/columns/constants';
import { DeleteCardsFromColumnUseCaseDto } from 'src/modules/columns/dto/useCase/delete-cards-from-column.use-case.dto';
import { ColumnRepositoryInterface } from 'src/modules/columns/repositories/column.repository.interface';
import { DELETE_VOTE_SERVICE } from 'src/modules/votes/constants';
import { DeleteVoteServiceInterface } from 'src/modules/votes/interfaces/services/delete.vote.service.interface';

@Injectable()
export class DeleteCardsFromColumnUseCase
	implements UseCase<DeleteCardsFromColumnUseCaseDto, Board>
{
	constructor(
		@Inject(COLUMN_REPOSITORY)
		private readonly columnRepository: ColumnRepositoryInterface,
		@Inject(GET_BOARD_SERVICE)
		private readonly getBoardService: GetBoardServiceInterface,
		@Inject(DELETE_VOTE_SERVICE)
		private readonly deleteVoteService: DeleteVoteServiceInterface
	) {}

	async execute({ boardId, columnToDelete, completionHandler }: DeleteCardsFromColumnUseCaseDto) {
		const board = await this.getBoard(boardId);

		const cardsToUpdate = board.columns.find((col) => String(col._id) === columnToDelete.id)?.cards;

		if (!cardsToUpdate) throw new NotFoundException(COLUMN_NOT_FOUND);

		await this.deleteVoteService.deleteCardVotesFromColumn(boardId, cardsToUpdate);

		const updateBoard = await this.deleteCards(boardId, columnToDelete.id);

		if (columnToDelete.socketId) {
			completionHandler();
		}

		return updateBoard;
	}

	private async getBoard(boardId: string) {
		const board = await this.getBoardService.getBoardById(boardId);

		if (!board) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return board;
	}

	private async deleteCards(boardId: string, columnId: string) {
		const updateBoard = await this.columnRepository.deleteCards(boardId, columnId);

		if (!updateBoard) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		return updateBoard;
	}
}
