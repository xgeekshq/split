import { Inject, Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import boardDto from '../dto/board.dto';
import { UpdateBoardApplication } from '../interfaces/applications/update.board.application.interface';
import { UpdateBoardService } from '../interfaces/services/update.board.service.interface';
import { TYPES } from '../interfaces/types';
import { BoardDocument } from '../schemas/board.schema';

@Injectable()
export class UpdateBoardApplicationImpl implements UpdateBoardApplication {
  constructor(
    @Inject(TYPES.services.UpdateBoardService)
    private updateBoardService: UpdateBoardService,
  ) {}

  update(
    userId: string,
    boardId: string,
    boardData: boardDto,
  ): Promise<LeanDocument<BoardDocument> | null> {
    return this.updateBoardService.update(userId, boardId, boardData);
  }
}
