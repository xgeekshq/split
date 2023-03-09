import { BoardUserRepository } from '../boardusers/repositories/board-user.repository';
import CreateBoardUserService from '../boardusers/services/create.board.user.service';

export const createBoardUserService = {
	provide: TYPES.services.CreateBoardUserService,
	useClass: CreateBoardUserService
};

export const boardUserRepository = {
	provide: TYPES.repositories.BoardUserRepository,
	useClass: BoardUserRepository
};
