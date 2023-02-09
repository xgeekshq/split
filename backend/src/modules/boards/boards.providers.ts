import { CreateBoardApplication } from './applications/create.board.application';
import { DeleteBoardApplication } from './applications/delete.board.application';
import { GetBoardApplication } from './applications/get.board.application';
import { UpdateBoardApplication } from './applications/update.board.application';
import { TYPES } from './interfaces/types';
import { BoardRepository } from './repositories/board.repository';
import CreateBoardServiceImpl from './services/create.board.service';
import DeleteBoardServiceImpl from './services/delete.board.service';
import GetBoardServiceImpl from './services/get.board.service';
import UpdateBoardServiceImpl from './services/update.board.service';

export const createBoardService = {
	provide: TYPES.services.CreateBoardService,
	useClass: CreateBoardServiceImpl
};

export const getBoardService = {
	provide: TYPES.services.GetBoardService,
	useClass: GetBoardServiceImpl
};

export const updateBoardService = {
	provide: TYPES.services.UpdateBoardService,
	useClass: UpdateBoardServiceImpl
};

export const deleteBoardService = {
	provide: TYPES.services.DeleteBoardService,
	useClass: DeleteBoardServiceImpl
};

export const createBoardApplication = {
	provide: TYPES.applications.CreateBoardApplication,
	useClass: CreateBoardApplication
};

export const getBoardApplication = {
	provide: TYPES.applications.GetBoardApplication,
	useClass: GetBoardApplication
};

export const updateBoardApplication = {
	provide: TYPES.applications.UpdateBoardApplication,
	useClass: UpdateBoardApplication
};

export const deleteBoardApplication = {
	provide: TYPES.applications.DeleteBoardApplication,
	useClass: DeleteBoardApplication
};

export const boardRepository = {
	provide: TYPES.repositories.BoardRepository,
	useClass: BoardRepository
};
