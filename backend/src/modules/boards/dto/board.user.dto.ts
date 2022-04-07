import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { BoardRoles } from '../../../libs/enum/board.roles';

export default class BoardUserDto {
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BoardRoles, { each: true })
  role!: string;

  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  user!: string;
}
