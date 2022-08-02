import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class UserDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	@IsMongoId()
	_id!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	firstName!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	lastName!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	email!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	strategy!: string;

	@ApiPropertyOptional({ default: false })
	@IsOptional()
	isSAdmin?: boolean;
}
