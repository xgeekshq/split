import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		type: String,
		format: 'email'
	})
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	email!: string;

	@ApiProperty({ type: String, format: 'password' })
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	@MinLength(7)
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/, {
		message:
			'Use at least 8 characters, upper and lower case letters, numbers and symbols like !“?$%^&).'
	})
	password!: string;
}
