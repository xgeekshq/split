import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import Board from '../entities/board.schema';

export default class BoardsPaginatedPresenter {
	@IsArray()
	@Type(() => Board)
	boards: Board[];

	@IsBoolean()
	hasNextPage: boolean;

	@IsNumber()
	page: number;
}
