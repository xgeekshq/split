import { Inject, Injectable } from '@nestjs/common';
import { GetBoardApplicationInterface } from '../interfaces/applications/get.board.application.interface';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { TYPES } from '../interfaces/types';
import UserDto from 'src/modules/users/dto/user.dto';

@Injectable()
export class GetBoardApplication implements GetBoardApplicationInterface {
	constructor(
		@Inject(TYPES.services.GetBoardService)
		private getBoardService: GetBoardServiceInterface
	) {}

	getPersonalBoards(userId?: string, page?: number, size?: number) {
		return this.getBoardService.getPersonalUserBoards(userId, page, size);
	}

	getBoard(boardId: string, user: UserDto) {
		return this.getBoardService.getBoard(boardId, user);
	}

	countBoards(userId: string) {
		return this.getBoardService.countBoards(userId);
	}

	getAllBoardIdsAndTeamIdsOfUser(userId: string) {
		return this.getBoardService.getAllBoardIdsAndTeamIdsOfUser(userId);
	}

	isBoardPublic(boardId: string) {
		return this.getBoardService.isBoardPublic(boardId);
	}
}
