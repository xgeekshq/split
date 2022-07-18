import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import CommentDto from '../../comments/dto/comment';

export default class CardItemDto {
	@IsOptional()
	@IsMongoId()
	@IsString()
	_id?: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	@IsMongoId()
	createdBy?: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CommentDto)
	comments!: CommentDto[];

	@IsNotEmpty()
	@ValidateNested({ each: true })
	votes!: string[];
}
