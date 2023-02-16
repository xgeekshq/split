import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export default class CreateGuestUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	firstName!: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	@MinLength(2)
	@Transform(({ value }: TransformFnParams) => value.trim())
	lastName?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	board!: string;
}
