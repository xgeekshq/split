import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import CardDto from 'src/modules/cards/dto/card.dto';

export default class ColumnDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }): string => value?.trim())
	title!: string;

	@ApiProperty()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	color!: string;

	@ApiProperty({ type: CardDto, isArray: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	cards!: CardDto[];

	@ApiProperty()
	@IsOptional()
	@IsString()
	cardText?: string;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isDefaultText?: boolean;

	@ApiProperty()
	@IsOptional()
	@IsString()
	socketId?: string;
}
