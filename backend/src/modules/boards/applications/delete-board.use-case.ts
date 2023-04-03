import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_NOT_FOUND } from 'src/libs/exceptions/messages';
import { ObjectId } from 'mongoose';
import isEmpty from 'src/libs/utils/isEmpty';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';

@Injectable()
export class DeleteBoardUseCase implements UseCase<string, boolean> {
	constructor(
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(TYPES.services.DeleteBoardService)
		private readonly deleteBoardService: DeleteBoardServiceInterface
	) {}

	async execute(boardId) {
		const board = await this.boardRepository.getBoard(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		const boardIdsToDelete: string[] = [boardId];

		if (!isEmpty(board.dividedBoards)) {
			const dividedBoards = (board.dividedBoards as ObjectId[]).map((subBoardId) =>
				subBoardId.toString()
			);
			boardIdsToDelete.push(...dividedBoards);
		}

		return this.deleteBoardService.deleteBoardBoardUsersAndSchedules(boardIdsToDelete);
	}
}
