import { IsMongoId, IsNumber, IsString } from 'class-validator';

import { BaseDto } from 'libs/dto/base.dto';

export default class UnmergeCardsDto extends BaseDto {
	@IsMongoId()
	@IsString()
	columnId!: string;

	@IsNumber()
	newPosition!: number;
}
