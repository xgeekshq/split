import { IsNotEmpty, ValidateNested } from 'class-validator';

import CardItemDto from './card.item.dto';

export default class CardDto extends CardItemDto {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	items!: CardItemDto[];
}
