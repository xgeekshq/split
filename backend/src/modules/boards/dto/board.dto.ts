import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsBoolean,
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

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  maxVotes?: string | null;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  maxUsers?: string | null;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  maxTeams?: string | null;

  @IsNotEmpty()
  @IsBoolean()
  hideCards!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hideVotes!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  postAnonymously!: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  dividedBoards!: BoardDto[];

  @IsOptional()
  @IsMongoId()
  @IsString()
  team?: string | null;

  @IsOptional()
  socketId?: string;

  @IsOptional()
  @Validate(CheckUniqueUsers)
  users!: BoardUserDto[];

  @IsNotEmpty()
  @IsBoolean()
  recurrent?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isSubBoard?: boolean;
}
