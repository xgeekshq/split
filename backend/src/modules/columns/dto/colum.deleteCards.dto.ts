import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../../libs/dto/base.dto';

export class ColumnDeleteCardsDto extends BaseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	id!: string;
}
