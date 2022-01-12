import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import CardItem from '../../schemas/card.item.schema';

export default class CardDto {
  @IsNotEmpty()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  text!: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  items!: CardItem[];

  // @ValidateNested({ each: true })
  // @Type(() => CommentDto)
  // comments!: CommentDto[];

  // @IsNotEmpty()
  // votes!: string[];
}
