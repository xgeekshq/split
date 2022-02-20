import { Inject, Injectable } from '@nestjs/common';
import boardDto from '../dto/board.dto';
import { UpdateBoardApplication } from '../interfaces/applications/update.board.application.interface';
import { UpdateBoardService } from '../interfaces/services/update.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class UpdateBoardApplicationImpl implements UpdateBoardApplication {
  constructor(
    @Inject(TYPES.services.UpdateBoardService)
    private updateBoardService: UpdateBoardService,
  ) {}

  update(userId: string, boardId: string, boardData: boardDto) {
    return this.updateBoardService.update(userId, boardId, boardData);
  }
}
