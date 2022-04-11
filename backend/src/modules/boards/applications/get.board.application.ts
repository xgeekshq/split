import { Inject, Injectable } from '@nestjs/common';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { GetBoardService } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetBoardApplication implements GetBoardApplicationInterface {
  constructor(
    @Inject(TYPES.services.GetBoardService)
    private getBoardService: GetBoardService,
  ) {}

  getAllBoards(userId: string) {
    return this.getBoardService.getAllBoards(userId);
  }

  getBoard(boardId: string, userId: string) {
    return this.getBoardService.getBoard(boardId, userId);
  }
}
