import { Inject, Injectable } from '@nestjs/common';
import UserDto from 'src/modules/users/dto/user.dto';
import { DeleteBoardApplicationInterface } from '../interfaces/applications/delete.board.application.interface';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteBoardApplication implements DeleteBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteBoardService)
		private deleteBoardService: DeleteBoardServiceInterface
	) {}

	delete(boardId: string, user: UserDto): Promise<boolean> {
		return this.deleteBoardService.delete(boardId, user);
	}
}
