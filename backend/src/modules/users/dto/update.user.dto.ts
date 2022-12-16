import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class UpdateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	@IsMongoId()
	_id!: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	firstName?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	lastName?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	email?: string;

	@ApiPropertyOptional({ default: false })
	@IsOptional()
	isSAdmin?: boolean;
}
