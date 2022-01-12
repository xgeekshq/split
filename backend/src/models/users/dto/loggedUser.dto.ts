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
  accessToken!: { expiresIn: string; token: string };

  @IsNotEmpty()
  refreshToken!: { expiresIn: string; token: string };
}
