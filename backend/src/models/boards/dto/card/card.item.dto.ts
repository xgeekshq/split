import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import CommentDto from '../comment/comment.dto';

export default class CardItemDto {
  @IsNotEmpty()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  text!: string;

  @IsNotEmpty()
  @IsString()
  createdBy!: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments!: CommentDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  votes!: string[];
}
