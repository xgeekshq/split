import { IsString, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export default class ColumnDto {
  @IsNotEmpty()
  @IsString()
  _id?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => value?.trim())
  title!: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  color!: string;

  @IsNotEmpty()
  cardsOrder!: string[];
}
