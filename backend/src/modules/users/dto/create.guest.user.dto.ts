import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export default class CreateGuestUserDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	firstName?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	lastName?: string;
}
