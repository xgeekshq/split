import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
	IsDateString,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MinLength
} from 'class-validator';

export default class CreateUserDto {
	@ApiProperty({ type: String, format: 'email' })
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	email!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	firstName!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	lastName!: string;

	@ApiProperty({
		type: String,
		pattern: String(/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/)
	})
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	@MinLength(7)
	@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/, {
		message:
			'Use at least 8 characters, upper and lower case letters, numbers and symbols like !“?$%^&).'
	})
	password!: string;

	@ApiProperty()
	@IsOptional()
	@IsDateString()
	providerAccountCreatedAt?: Date;
}
