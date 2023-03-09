import { Inject, Injectable } from '@nestjs/common';
import CardDto from '../dto/card.dto';
import { CreateCardApplicationInterface } from '../interfaces/applications/create.card.application.interface';
import { CreateCardServiceInterface } from '../interfaces/services/create.card.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateCardApplication implements CreateCardApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateCardService)
		private createCardService: CreateCardServiceInterface
	) {}

	create(cardId: string, userId: string, card: CardDto, colIdToAdd: string) {
		return this.createCardService.create(cardId, userId, card, colIdToAdd);
	}
}
