import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { ObjectID } from 'typeorm';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import ColumnDto from './column.dto';
import UserDto from '../../users/dto/user.dto';
import CardDto from './card.dto';

export default class BoardDto {
  @Optional()
  _id?: ObjectID;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  title!: string;

  @ArrayNotEmpty()
  @ArrayMinSize(3)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  columns!: ColumnDto[];

  @IsNotEmpty()
  @IsBoolean()
  locked!: boolean;

  @IsNotEmpty()
  @Type(() => UserDto)
  createdBy!: UserDto;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  password?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards!: CardDto[];

  @IsNotEmpty()
  columnsOrder!: string[];
}
