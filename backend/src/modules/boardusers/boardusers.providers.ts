import { BoardUserRepository } from '../boardusers/repositories/board-user.repository';
import CreateBoardUserService from '../boardusers/services/create.board.user.service';
import { TYPES } from './interfaces/types';
import DeleteBoardUserService from './services/delete.board.user.service';
import GetBoardUserService from './services/get.board.user.service';
import UpdateBoardUserService from './services/update.board.user.service';

export const createBoardUserService = {
	provide: TYPES.services.CreateBoardUserService,
	useClass: CreateBoardUserService
};

export const getBoardUserService = {
	provide: TYPES.services.GetBoardUserService,
	useClass: GetBoardUserService
};

export const updateBoardUserService = {
	provide: TYPES.services.UpdateBoardUserService,
	useClass: UpdateBoardUserService
};

export const deleteBoardUserService = {
	provide: TYPES.services.DeleteBoardUserService,
	useClass: DeleteBoardUserService
};

export const boardUserRepository = {
	provide: TYPES.repositories.BoardUserRepository,
	useClass: BoardUserRepository
};
