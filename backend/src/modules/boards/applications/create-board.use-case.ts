import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from '../entities/board.schema';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import CreateBoardUseCaseDto from '../dto/useCase/create-board.use-case.dto';

@Injectable()
export class CreateBoardUseCase implements UseCase<CreateBoardUseCaseDto, Board> {
	constructor(
		@Inject(TYPES.services.CreateBoardService)
		private readonly createBoardService: CreateBoardServiceInterface
	) {}

	async execute(createBoardData: CreateBoardUseCaseDto) {
		const { boardData, userId } = createBoardData;

		return this.createBoardService.create(boardData, userId);
	}
}
