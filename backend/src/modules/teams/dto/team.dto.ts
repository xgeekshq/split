import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  Validate,
} from 'class-validator';
import { CheckUniqueUsers } from '../../../libs/validators/check-unique-users';
import TeamUserDto from './team.user.dto';

export default class TeamDto {
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @Validate(CheckUniqueUsers)
  users!: TeamUserDto[];
}
