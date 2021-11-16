import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import CardDto from './card.dto';

export class ColumnDto {
  @IsString()
  _id: string = uuidv4();

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

export default ColumnDto;
