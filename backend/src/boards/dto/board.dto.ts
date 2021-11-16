import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import ColumnDto from './column.dto';

class BoardDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  title: string;

  @ArrayNotEmpty()
  @ArrayMinSize(3)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  columns: ColumnDto[];

  @IsNotEmpty()
  locked: boolean;

  @IsEmail()
  @IsNotEmpty()
  createdBy: string;

  @IsOptional()
  password: string;
}
export default BoardDto;
