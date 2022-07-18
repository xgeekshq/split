import { Inject, Injectable } from '@nestjs/common';

import CardDto from '../dto/card.dto';
import { CreateCardApplication } from '../interfaces/applications/create.card.application.interface';
import { CreateCardService } from '../interfaces/services/create.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateCardApplicationImpl implements CreateCardApplication {
	constructor(
		@Inject(TYPES.services.CreateCardService)
		private createCardService: CreateCardService
	) {}

	create(cardId: string, userId: string, card: CardDto, colIdToAdd: string) {
		return this.createCardService.create(cardId, userId, card, colIdToAdd);
	}
}
