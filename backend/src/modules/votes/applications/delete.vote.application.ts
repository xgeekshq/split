import { Inject, Injectable } from '@nestjs/common';
import { DeleteVoteApplicationInterface } from '../interfaces/applications/delete.vote.application.interface';
import { DeleteVoteServiceInterface } from '../interfaces/services/delete.vote.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class DeleteVoteApplicationImpl implements DeleteVoteApplicationInterface {
	constructor(
		@Inject(TYPES.services.DeleteVoteService)
		private deleteVoteService: DeleteVoteServiceInterface
	) {}

	deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		return this.deleteVoteService.deleteVoteFromCard(boardId, cardId, userId, cardItemId, count);
	}

	deleteVoteFromCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		return this.deleteVoteService.deleteVoteFromCardGroup(boardId, cardId, userId, count);
	}
}
