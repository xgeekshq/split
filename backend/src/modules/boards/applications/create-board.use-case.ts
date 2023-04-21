import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from '../entities/board.schema';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import CreateBoardUseCaseDto from '../dto/useCase/create-board.use-case.dto';
import { CREATE_BOARD_SERVICE } from 'src/modules/boards/constants';

@Injectable()
export class CreateBoardUseCase implements UseCase<CreateBoardUseCaseDto, Board> {
	constructor(
		@Inject(CREATE_BOARD_SERVICE)
		private readonly createBoardService: CreateBoardServiceInterface
	) {}

	async execute(createBoardData: CreateBoardUseCaseDto) {
		const { boardData, userId } = createBoardData;

		return this.createBoardService.create(boardData, userId);
	}
}
