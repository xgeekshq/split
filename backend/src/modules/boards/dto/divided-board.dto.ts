import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
	ValidateNested
} from 'class-validator';

import { CheckUniqueUsers } from 'libs/validators/check-unique-users';

import BoardUserDto from './board.user.dto';
import ColumnDto from './column/column.dto';

export default class DividedBoardDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	title!: string;

	@ApiProperty({ type: ColumnDto })
	@ArrayNotEmpty()
	@ArrayMinSize(3)
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ColumnDto)
	columns!: ColumnDto[];

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	isPublic!: boolean;

	@ApiPropertyOptional({ type: String })
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	maxVotes?: string | null;

	@ApiPropertyOptional({ type: String })
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	maxUsers?: string | null;

	@ApiPropertyOptional({ type: String })
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	maxTeams?: string | null;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	hideCards!: boolean;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	hideVotes!: boolean;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	postAnonymously!: boolean;

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsMongoId()
	@IsString()
	team?: string | null;

	@ApiPropertyOptional()
	@IsOptional()
	socketId?: string;

	@ApiPropertyOptional({ type: BoardUserDto, isArray: true })
	@IsOptional()
	@Validate(CheckUniqueUsers)
	users!: BoardUserDto[];

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	recurrent?: boolean;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	isSubBoard?: boolean;
}
