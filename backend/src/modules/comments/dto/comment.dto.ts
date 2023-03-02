import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export default class CommentDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@ApiProperty({ description: 'User Id' })
	@IsMongoId()
	createdBy!: string;

	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;
}
