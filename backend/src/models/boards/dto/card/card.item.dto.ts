import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export default class CardItemDto {
  @IsNotEmpty()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  text!: string;

  // @ValidateNested({ each: true })
  // @Type(() => CommentDto)
  // comments!: CommentDto[];

  // @IsNotEmpty()
  // votes!: string[];
}
