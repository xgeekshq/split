import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import CardItemDto from './card.item.dto';

export default class CardDto extends CardItemDto {
	@ApiProperty({ type: CardItemDto, isArray: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CardItemDto)
	items!: CardItemDto[];
}
