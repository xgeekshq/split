import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';
import Card from '../schemas/card.schema';
import CardDto from './card.dto';

export class CreateCardDto extends BaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	colIdToAdd!: string;

	@ApiProperty({ type: CardDto })
	@IsNotEmpty()
	@Type(() => CardDto)
	card!: CardDto;

	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	boardId: string;

	newCard?: Card;
}
