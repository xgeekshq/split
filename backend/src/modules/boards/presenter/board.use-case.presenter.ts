import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { LoginGuestUserResponse } from 'src/libs/dto/response/login-guest-user.response';
import Board from '../entities/board.schema';

export default class BoardUseCasePresenter {
	@Type(() => Board)
	board: Board;

	@Type(() => Board)
	@IsOptional()
	mainBoard?: Board;

	@Type(() => LoginGuestUserResponse)
	@IsOptional()
	guestUser?: LoginGuestUserResponse;
}
