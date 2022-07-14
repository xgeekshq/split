import { IsMongoId } from 'class-validator';

import { CardParams } from './card.params';

export class UpdateCardItemParams extends CardParams {
	@IsMongoId()
	itemId!: string;
}
