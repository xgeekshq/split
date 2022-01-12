import { IsNotEmpty, IsString } from 'class-validator';

export default class UserDto {
  @IsNotEmpty()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;
}
