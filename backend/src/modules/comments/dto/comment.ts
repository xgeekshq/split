import { Transform, TransformFnParams } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CommentDto {
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@IsOptional()
	@IsString()
	@IsMongoId()
	createdBy?: string;
}
