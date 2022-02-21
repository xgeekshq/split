import { CreateCommentApplicationImpl } from './applications/create.comment.application';
import { DeleteCommentApplicationImpl } from './applications/delete.comment.application';
import { UpdateCommentApplicationImpl } from './applications/update.comment.application';
import { TYPES } from './interfaces/types';
import CreateCommentServiceImpl from './services/create.comment.service';
import DeleteCommentServiceImpl from './services/delete.comment.service';
import UpdateCommentServiceImpl from './services/update.comment.service';

export const createCommentService = {
  provide: TYPES.services.CreateCommentService,
  useClass: CreateCommentServiceImpl,
};

export const updateCommentService = {
  provide: TYPES.services.UpdateCommentService,
  useClass: UpdateCommentServiceImpl,
};

export const deleteCommentService = {
  provide: TYPES.services.DeleteCommentService,
  useClass: DeleteCommentServiceImpl,
};

export const createCommentApplication = {
  provide: TYPES.applications.CreateCommentApplication,
  useClass: CreateCommentApplicationImpl,
};

export const updateCommentApplication = {
  provide: TYPES.applications.UpdateCommentApplication,
  useClass: UpdateCommentApplicationImpl,
};

export const deleteCommentApplication = {
  provide: TYPES.applications.DeleteCommentApplication,
  useClass: DeleteCommentApplicationImpl,
};
