import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { BoardRoles } from 'libs/enum/board.roles';

export default class BoardUserDto {
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum(BoardRoles, { each: true })
	role!: string;

	@IsMongoId()
	@IsString()
	@IsNotEmpty()
	user!: string;

	@IsOptional()
	@IsNumber()
	votesCount?: number;
}
