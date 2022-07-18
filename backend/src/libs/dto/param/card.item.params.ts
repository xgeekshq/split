import { IsMongoId, IsString } from 'class-validator';

import { CardGroupParams } from './card.group.params';

export class CardItemParams extends CardGroupParams {
	@IsMongoId()
	@IsString()
	itemId!: string;
}
