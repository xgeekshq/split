import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import CardItemDto from './card.item.dto';

export default class CardDto extends CardItemDto {
	@ApiProperty({ type: CardItemDto, isArray: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CardItemDto)
	items!: CardItemDto[];

	@ApiProperty({ description: 'Team Id' })
	@IsNotEmpty()
	@IsMongoId()
	createdByTeam!: string;

	@ApiProperty({ type: Date })
	@IsNotEmpty()
	@IsMongoId()
	createdAt!: Date;

	@ApiProperty({ description: 'User Id' })
	@IsNotEmpty()
	@IsMongoId()
	createdBy!: string;
}
