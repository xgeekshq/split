import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export default class MainBoard {
	@ApiPropertyOptional()
	@IsNotEmpty()
	@IsMongoId()
	_id!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	title!: string;
}
