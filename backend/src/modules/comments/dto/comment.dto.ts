import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CommentDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@ApiProperty({ description: 'User Id' })
	@IsOptional()
	@IsMongoId()
	createdBy!: string;

	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;
}
