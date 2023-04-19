import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DELETE_BOARD_SERVICE, TYPES } from '../constants';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_NOT_FOUND } from 'src/libs/exceptions/messages';
import { ObjectId } from 'mongoose';
import isEmpty from 'src/libs/utils/isEmpty';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import DeleteBoardUseCaseDto from 'src/modules/boards/dto/useCase/delete-board.use-case';

@Injectable()
export class DeleteBoardUseCase implements UseCase<DeleteBoardUseCaseDto, boolean> {
	constructor(
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(DELETE_BOARD_SERVICE)
		private readonly deleteBoardService: DeleteBoardServiceInterface
	) {}

	async execute({ boardId, completionHandler }: DeleteBoardUseCaseDto) {
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

		const wasDeleted = await this.deleteBoardService.deleteBoardBoardUsersAndSchedules(
			boardIdsToDelete
		);

		if (wasDeleted) {
			completionHandler(boardIdsToDelete);
		}

		return wasDeleted;
	}
}
