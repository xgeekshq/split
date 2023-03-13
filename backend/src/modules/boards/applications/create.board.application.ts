import { Inject, Injectable } from '@nestjs/common';
import BoardDto from '../dto/board.dto';
import { CreateBoardApplicationInterface } from '../interfaces/applications/create.board.application.interface';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import { TYPES } from '../interfaces/types';
import Board from '../entities/board.schema';

@Injectable()
export class CreateBoardApplication implements CreateBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateBoardService)
		private createBoardService: CreateBoardServiceInterface
	) {}

	create(board: BoardDto, userId: string): Promise<Board> {
		return this.createBoardService.create(board, userId);
	}
}
