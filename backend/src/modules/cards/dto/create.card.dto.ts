import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';
import CardDto from './card.dto';

export class CreateCardDto extends BaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	@IsMongoId()
	colIdToAdd!: string;

	@ApiProperty({ type: CardDto })
	@IsNotEmpty()
	@Type(() => CardDto)
	card!: CardDto;
}
