import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator';
import { BoardRoles } from 'src/libs/enum/board.roles';
import User from 'src/modules/users/entities/user.schema';

export default class BoardUserDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@ApiProperty({ type: String, enum: BoardRoles, enumName: 'Roles' })
	@IsString()
	@IsNotEmpty()
	@IsEnum(BoardRoles, { each: true })
	role!: string;

	@ApiProperty()
	@IsNotEmpty()
	user!: string | User;

	@ApiProperty()
	@IsMongoId()
	@IsString()
	@IsOptional()
	board?: string;

	@ApiPropertyOptional({ default: 0 })
	@IsNumber()
	votesCount: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	isNewJoiner?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	canBeResponsible?: boolean;
}
