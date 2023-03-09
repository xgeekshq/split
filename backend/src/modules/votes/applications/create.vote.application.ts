import { Inject, Injectable } from '@nestjs/common';
import { CreateVoteApplicationInterface } from '../interfaces/applications/create.vote.application.interface';
import { CreateVoteServiceInterface } from '../interfaces/services/create.vote.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateVoteApplication implements CreateVoteApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateVoteService)
		private createVoteService: CreateVoteServiceInterface
	) {}

	addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	) {
		return this.createVoteService.addVoteToCard(boardId, cardId, userId, cardItemId, count);
	}

	addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number) {
		return this.createVoteService.addVoteToCardGroup(boardId, cardId, userId, count);
	}
}
