import { Inject, Injectable } from '@nestjs/common';

import { CreateVoteApplication } from '../interfaces/applications/create.vote.application.interface';
import { CreateVoteService } from '../interfaces/services/create.vote.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateVoteApplicationImpl implements CreateVoteApplication {
	constructor(
		@Inject(TYPES.services.CreateVoteService)
		private createVoteService: CreateVoteService
	) {}

	addVoteToCard(boardId: string, cardId: string, userId: string, cardItemId: string) {
		return this.createVoteService.addVoteToCard(boardId, cardId, userId, cardItemId);
	}

	addVoteToCardGroup(boardId: string, cardId: string, userId: string) {
		return this.createVoteService.addVoteToCardGroup(boardId, cardId, userId);
	}
}
