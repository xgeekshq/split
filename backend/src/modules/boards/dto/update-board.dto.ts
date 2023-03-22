import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import BoardUser from '../../boardUsers/entities/board.user.schema';
import BoardDto from './board.dto';

export class UpdateBoardDto extends PartialType(BoardDto) {
	@ApiPropertyOptional({ type: BoardUser, isArray: true })
	@IsOptional()
	responsible?: BoardUser;

	@ApiProperty({ type: String, isArray: true })
	@IsOptional()
	@Type(() => String)
	deletedColumns?: string[];

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	mainBoardId?: string;
}
