import { IsNotEmpty, IsString } from 'class-validator';

export default class LoggedUserDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsNotEmpty()
  @IsString()
  accessTokenExpiresIn!: string;

  @IsNotEmpty()
  @IsString()
  refreshToken!: string;

  @IsNotEmpty()
  @IsString()
  refreshTokenExpiresIn!: string;
}
