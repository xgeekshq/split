import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_NOT_FOUND } from 'src/libs/exceptions/messages';

@Injectable()
export class IsBoardPublicUseCase implements UseCase<string, boolean> {
	constructor(
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface
	) {}

	async execute(boardId) {
		const board = await this.boardRepository.isBoardPublic(boardId);

		if (!board) {
			throw new NotFoundException(BOARD_NOT_FOUND);
		}

		return board.isPublic;
	}
}
