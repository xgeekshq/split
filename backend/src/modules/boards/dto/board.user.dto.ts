import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { BoardRoles } from 'libs/enum/board.roles';

export default class BoardUserDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@IsEnum(BoardRoles, { each: true })
	role!: string;

	@ApiProperty()
	@IsMongoId()
	@IsString()
	@IsNotEmpty()
	user!: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	votesCount?: number;
}
