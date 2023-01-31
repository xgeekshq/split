import { PartialType } from '@nestjs/mapped-types';
import BoardDto from './board.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateBoardDto extends PartialType(BoardDto) {
	@ApiProperty({ type: String, isArray: true })
	@IsOptional()
	@Type(() => String)
	deletedColumns?: string[];
}
