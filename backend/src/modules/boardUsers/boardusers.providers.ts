import { BoardUserRepository } from './repositories/board-user.repository';
import CreateBoardUserService from './services/create.board.user.service';
import {
	BOARD_USER_REPOSITORY,
	CREATE_BOARD_USER_SERVICE,
	DELETE_BOARD_USER_SERVICE,
	GET_BOARD_USER_SERVICE,
	UPDATE_BOARD_USERS_USE_CASE,
	UPDATE_BOARD_USER_SERVICE
} from './constants';
import DeleteBoardUserService from './services/delete.board.user.service';
import GetBoardUserService from './services/get.board.user.service';
import UpdateBoardUserService from './services/update.board.user.service';
import { UpdateBoardUsersUseCase } from './applications/update-board-users.use-case';

/* USE CASES */

export const updateBoardUsersUseCase = {
	provide: UPDATE_BOARD_USERS_USE_CASE,
	useClass: UpdateBoardUsersUseCase
};

/* SERVICE */

export const createBoardUserService = {
	provide: CREATE_BOARD_USER_SERVICE,
	useClass: CreateBoardUserService
};

export const getBoardUserService = {
	provide: GET_BOARD_USER_SERVICE,
	useClass: GetBoardUserService
};

export const updateBoardUserService = {
	provide: UPDATE_BOARD_USER_SERVICE,
	useClass: UpdateBoardUserService
};

export const deleteBoardUserService = {
	provide: DELETE_BOARD_USER_SERVICE,
	useClass: DeleteBoardUserService
};

/* REPOSITORY */

export const boardUserRepository = {
	provide: BOARD_USER_REPOSITORY,
	useClass: BoardUserRepository
};
