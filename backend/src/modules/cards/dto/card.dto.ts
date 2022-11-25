import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import CardItemDto from './card.item.dto';

export default class CardDto extends CardItemDto {
	@ApiProperty({ type: CardItemDto, isArray: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	items!: CardItemDto[];
}
