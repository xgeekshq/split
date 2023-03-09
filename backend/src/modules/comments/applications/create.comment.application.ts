import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentApplicationInterface } from '../interfaces/applications/create.comment.application.interface';
import { CreateCommentServiceInterface } from '../interfaces/services/create.comment.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateCommentApplication implements CreateCommentApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateCommentService)
		private createCommentService: CreateCommentServiceInterface
	) {}

	createItemComment(
		boardId: string,
		cardId: string,
		itemId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	) {
		return this.createCommentService.createItemComment(
			boardId,
			cardId,
			itemId,
			userId,
			text,
			anonymous,
			columnId
		);
	}

	createCardGroupComment(
		boardId: string,
		cardId: string,
		userId: string,
		text: string,
		anonymous: boolean,
		columnId: string
	) {
		return this.createCommentService.createCardGroupComment(
			boardId,
			cardId,
			userId,
			text,
			anonymous,
			columnId
		);
	}
}
