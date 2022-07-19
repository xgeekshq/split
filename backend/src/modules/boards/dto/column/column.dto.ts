import { Transform, TransformFnParams } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import CardDto from 'modules/cards/dto/card.dto';

export default class ColumnDto {
	@IsOptional()
	@IsMongoId()
	_id?: string;

	@IsNotEmpty()
	@IsString()
	@Transform(({ value }): string => value?.trim())
	title!: string;

	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value.trim())
	color!: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	cards!: CardDto[];
}
