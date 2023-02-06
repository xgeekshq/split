import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import ColumnDto from './column.dto';

export class UpdateColumnDto extends PartialType(ColumnDto) {
	@ApiProperty()
	@IsOptional()
	@IsString()
	socketId?: string;
}
