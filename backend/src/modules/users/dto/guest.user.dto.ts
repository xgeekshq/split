import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class GuestUserDto {
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
	@IsOptional()
	@IsString()
	lastName?: string;

	@IsOptional()
	@IsBoolean()
	isAnonymous?: boolean;
}
