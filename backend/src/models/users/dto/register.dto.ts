import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export default class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: TransformFnParams) => value.trim())
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @MinLength(7)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/, {
    message:
      'Password too weak. Must have 1 uppercase, 1 lowercase, 1 number and 1 special character',
  })
  password!: string;
}
