import { Type } from 'class-transformer';
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
import GuestUserDto from 'src/modules/users/dto/guest.user.dto';

export default class BoardGuestUserDto {
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum(BoardRoles, { each: true })
	role!: string;

	@IsNotEmpty()
	@Type(() => GuestUserDto)
	user!: GuestUserDto;

	@IsMongoId()
	@IsString()
	@IsOptional()
	board?: string;

	@IsOptional()
	@IsNumber()
	votesCount?: number;

	@IsOptional()
	@IsBoolean()
	isNewJoiner?: boolean;

	@IsOptional()
	@IsBoolean()
	canBeResponsible?: boolean;
}
