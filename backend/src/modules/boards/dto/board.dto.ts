import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Validate,
	ValidateNested
} from 'class-validator';
import { CheckUniqueUsers } from 'src/libs/validators/check-unique-users';
import BoardUserDto from '../../boardusers/dto/board.user.dto';
import ColumnDto from '../../columns/dto/column.dto';
import { BoardPhases } from 'src/libs/enum/board.phases';

export default class BoardDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	title!: string;

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	createdBy?: string;

	@ApiProperty({ type: ColumnDto, isArray: true })
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ColumnDto)
	columns!: ColumnDto[];

	@ApiProperty({ default: false })
	@IsNotEmpty()
	@IsBoolean()
	isPublic!: boolean;

	@ApiPropertyOptional({ type: String })
	@IsNumber()
	@IsOptional()
	maxVotes?: number | null;

	@ApiPropertyOptional({ type: Number })
	@IsNotEmpty()
	@IsNumber()
	@IsOptional()
	maxUsers?: number;

	@ApiPropertyOptional({ type: String })
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	maxTeams?: string | null;

	@ApiProperty({ default: false })
	@IsNotEmpty()
	@IsBoolean()
	hideCards!: boolean;

	@ApiProperty({ default: false })
	@IsNotEmpty()
	@IsBoolean()
	hideVotes!: boolean;

	@ApiProperty({ type: BoardDto, isArray: true })
	@ValidateNested({ each: true })
	@Type(() => BoardDto)
	@IsOptional()
	dividedBoards!: BoardDto[] | string[];

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

	@ApiPropertyOptional({ default: true })
	@IsNotEmpty()
	@IsBoolean()
	recurrent?: boolean;

	@ApiPropertyOptional({ default: false })
	@IsNotEmpty()
	@IsBoolean()
	isSubBoard?: boolean;

	@ApiPropertyOptional({ default: 0 })
	@IsNotEmpty()
	@IsNumber()
	boardNumber?: number;

	@ApiPropertyOptional({ default: false })
	@IsOptional()
	@IsBoolean()
	slackEnable?: boolean;

	@ApiPropertyOptional({ default: false })
	@IsOptional()
	@IsBoolean()
	addCards?: boolean;

	@ApiPropertyOptional({ default: false })
	@IsOptional()
	@IsBoolean()
	postAnonymously?: boolean;

	@ApiProperty({ type: String, isArray: true })
	responsibles!: string[];

	@ApiProperty({ type: String, enum: BoardPhases, enumName: 'Phase' })
	@IsString()
	@IsOptional()
	@IsEnum(BoardPhases, { each: true })
	phase?: string;
}
