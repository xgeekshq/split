import { Inject, Injectable } from '@nestjs/common';
import { DeleteBoardApplication } from '../interfaces/applications/delete.board.application.interface';
import { DeleteBoardService } from '../interfaces/services/delete.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteBoardApplicationImpl implements DeleteBoardApplication {
  constructor(
    @Inject(TYPES.services.DeleteBoardService)
    private deleteBoardService: DeleteBoardService,
  ) {}

  async delete(boardId: string, userId: string): Promise<boolean> {
    return this.deleteBoardService.delete(boardId, userId);
  }
}
