import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import CardDto from './card.dto';

export default class ColumnDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => value?.trim())
  title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  color: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards: CardDto[];
}
