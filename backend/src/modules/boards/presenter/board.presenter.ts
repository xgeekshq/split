import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import Board from '../entities/board.schema';

export default class BoardPresenter {
	@Type(() => Board)
	board: Board;

	@Type(() => Board)
	@IsOptional()
	mainBoard?: Board;
}
