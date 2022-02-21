import { Inject, Injectable } from '@nestjs/common';
import { GetBoardApplication } from '../interfaces/applications/get.board.application.interface';
import { GetBoardService } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetBoardApplicationImpl implements GetBoardApplication {
  constructor(
    @Inject(TYPES.services.GetBoardService)
    private getBoardService: GetBoardService,
  ) {}

  getAllBoards(userId: string) {
    return this.getBoardService.getAllBoards(userId);
  }

  getBoardWithEmail(boardId: string, userId: string) {
    return this.getBoardService.getBoardWithEmail(boardId, userId);
  }
}
