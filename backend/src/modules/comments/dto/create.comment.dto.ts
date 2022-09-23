import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

import { BaseDto } from 'libs/dto/base.dto';

export default class CreateCommentDto extends BaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@IsBoolean()
	anonymous!: boolean;
}
