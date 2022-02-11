import { CreateBoardApplicationImpl } from './applications/create.board.application';
import { DeleteBoardApplicationImpl } from './applications/delete.board.application';
import { GetBoardApplicationImpl } from './applications/get.board.application';
import { UpdateBoardApplicationImpl } from './applications/update.board.application';
import { TYPES } from './interfaces/types';
import CreateBoardServiceImpl from './services/create.board.service';
import DeleteBoardServiceImpl from './services/delete.board.service';
import GetBoardServiceImpl from './services/get.board.service';
import UpdateBoardServiceImpl from './services/update.board.service';

export const createBoardService = {
  provide: TYPES.services.CreateBoardService,
  useClass: CreateBoardServiceImpl,
};

export const getBoardService = {
  provide: TYPES.services.GetBoardService,
  useClass: GetBoardServiceImpl,
};

export const updateBoardService = {
  provide: TYPES.services.UpdateBoardService,
  useClass: UpdateBoardServiceImpl,
};

export const deleteBoardService = {
  provide: TYPES.services.DeleteBoardService,
  useClass: DeleteBoardServiceImpl,
};

export const createBoardApplication = {
  provide: TYPES.applications.CreateBoardApplication,
  useClass: CreateBoardApplicationImpl,
};

export const getBoardApplication = {
  provide: TYPES.applications.GetBoardApplication,
  useClass: GetBoardApplicationImpl,
};

export const updateBoardApplication = {
  provide: TYPES.applications.UpdateBoardApplication,
  useClass: UpdateBoardApplicationImpl,
};

export const deleteBoardApplication = {
  provide: TYPES.applications.DeleteBoardApplication,
  useClass: DeleteBoardApplicationImpl,
};
