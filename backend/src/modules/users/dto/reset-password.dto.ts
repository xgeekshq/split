import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	token!: string;

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
			'Password too weak. Must have 1 uppercase, 1 lowercase, 1 number and 1 special character'
	})
	newPassword!: string;

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
			'Password too weak. Must have 1 uppercase, 1 lowercase, 1 number and 1 special character'
	})
	newPasswordConf!: string;
}
