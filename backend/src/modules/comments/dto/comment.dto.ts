import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CommentDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@ApiPropertyOptional({ description: 'User Id' })
	@IsOptional()
	@IsString()
	@IsMongoId()
	createdBy?: string;
}
