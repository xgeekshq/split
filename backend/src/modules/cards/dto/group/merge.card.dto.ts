import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

import { BaseDto } from '../libs/dto/base.dto';

export class MergeCardDto extends BaseDto {
	@IsMongoId()
	@IsNotEmpty()
	@IsString()
	userId!: string;
}
