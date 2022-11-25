import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/libs/dto/base.dto';

export default class UnmergeCardsDto extends BaseDto {
	@ApiProperty()
	@IsMongoId()
	@IsString()
	columnId!: string;

	@ApiProperty()
	@IsNumber()
	newPosition!: number;
}
