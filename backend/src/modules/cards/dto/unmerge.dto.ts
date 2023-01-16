import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export default class UnmergeCardsDto extends BaseDto {
	@ApiProperty()
	@IsMongoId()
	columnId!: string;

	@ApiProperty()
	@IsNumber()
	newPosition!: number;

	@ApiProperty()
	@IsMongoId()
	cardId: string;

	@ApiProperty()
	@IsMongoId()
	boardId: string;

	@ApiProperty()
	@IsMongoId()
	cardGroupId: string;

	@ApiProperty()
	@IsString()
	socketId: string;

	@ApiProperty()
	@IsMongoId()
	@IsOptional()
	newCardItemId?: string;
}
