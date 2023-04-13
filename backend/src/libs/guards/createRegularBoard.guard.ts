import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import BoardDto from 'src/modules/boards/dto/board.dto';
import isEmpty from '../utils/isEmpty';

@Injectable()
export class CreateRegularBoardGuard implements CanActivate {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const boardData: BoardDto = request.body as BoardDto;

		const isRegularBoard = isEmpty(boardData.dividedBoards);
		const hasResponsibles = !isEmpty(boardData.responsibles);

		const canCreateBoard = !isRegularBoard || (isRegularBoard && hasResponsibles);

		if (!canCreateBoard) {
			throw new BadRequestException();
		}

		return canCreateBoard;
	}
}
