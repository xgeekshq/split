import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateIf,
  IsMongoId,
  Validate,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import ColumnDto from './column/column.dto';
import BoardUserDto from './board.user.dto';
import { CheckUniqueUsers } from '../../../libs/validators/check-unique-users';

export default class BoardDto {
  @IsOptional()
  @IsMongoId()
  _id?: string;

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
  isPublic!: boolean;

  @ValidateIf((o) => o.isPublic === false)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  password?: string;

  @IsNotEmpty()
  @IsNumber()
  maxVotes!: number;

  @IsOptional()
  @ValidateNested({ each: true })
  dividedBoards?: BoardDto[];

  // @IsOptional()
  // @IsMongoId()
  // @IsString()
  // team?: string;

  @IsOptional()
  socketId?: string;

  @IsOptional()
  @Validate(CheckUniqueUsers)
  users!: BoardUserDto[];
}
