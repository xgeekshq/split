import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Token } from '../../../libs/interfaces/jwt/token.interface';

export default class LoggedUserDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  accessToken!: Token;

  @IsNotEmpty()
  refreshToken!: Token;
}
