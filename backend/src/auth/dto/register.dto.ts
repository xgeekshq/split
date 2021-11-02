import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: TransformFnParams) => value.trim())
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @MinLength(7)
  password: string;
}

export default RegisterDto;
