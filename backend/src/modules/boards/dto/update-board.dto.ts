import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import BoardUser from '../schemas/board.user.schema';
import BoardDto from './board.dto';

export class UpdateBoardDto extends PartialType(BoardDto) {
	@ApiPropertyOptional({ type: BoardUser, isArray: true })
	@IsOptional()
	responsible?: BoardUser;
}
