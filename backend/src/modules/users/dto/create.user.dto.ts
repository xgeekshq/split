import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export default class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	email!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	firstName!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	lastName!: string;

	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	@MinLength(7)
	@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/, {
		message:
			'Use at least 8 characters, upper and lower case letters, numbers and symbols like !“?$%^&).'
	})
	password!: string;
}
