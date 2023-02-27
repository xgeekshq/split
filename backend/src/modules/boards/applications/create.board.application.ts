import { Inject, Injectable } from '@nestjs/common';
import BoardDto from '../dto/board.dto';
import { CreateBoardApplicationInterface } from '../interfaces/applications/create.board.application.interface';
import { CreateBoardService } from '../interfaces/services/create.board.service.interface';
import { TYPES } from '../interfaces/types';
import { BoardDocument } from '../entities/board.schema';
import { BoardUserDocument } from '../entities/board.user.schema';

@Injectable()
export class CreateBoardApplication implements CreateBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateBoardService)
		private createBoardService: CreateBoardService
	) {}

	createBoardUser(board: string, user: string): Promise<BoardUserDocument> {
		return this.createBoardService.createBoardUser(board, user);
	}

	create(board: BoardDto, userId: string): Promise<BoardDocument> {
		return this.createBoardService.create(board, userId);
	}
}
