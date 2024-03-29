import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import CommentDto from 'src/modules/comments/dto/comment.dto';

export default class CardItemDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	@IsString()
	_id?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value.trim())
	text!: string;

	@ApiPropertyOptional({ description: 'User Id' })
	@IsOptional()
	createdBy?: string;

	@ApiProperty({ type: CommentDto, isArray: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CommentDto)
	comments!: CommentDto[];

	@ApiProperty({ type: String, isArray: true })
	@IsNotEmpty()
	votes!: string[];

	@ApiProperty({ default: false })
	@IsNotEmpty()
	@IsBoolean()
	anonymous!: boolean;
}
