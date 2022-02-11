import { CreateCardApplicationImpl } from './applications/create.card.application';
import { DeleteCardApplicationImpl } from './applications/delete.card.application';
import { UpdateCardApplicationImpl } from './applications/update.card.application';
import { TYPES } from './interfaces/type';
import CreateCardServiceImpl from './services/create.card.service';
import DeleteCardServiceImpl from './services/delete.card.service';
import GetCardServiceImpl from './services/get.card.service';
import UpdateCardServiceImpl from './services/update.card.service';

export const createCardService = {
  provide: TYPES.services.CreateCardService,
  useClass: CreateCardServiceImpl,
};

export const getCardService = {
  provide: TYPES.services.GetCardService,
  useClass: GetCardServiceImpl,
};

export const updateCardService = {
  provide: TYPES.services.UpdateCardService,
  useClass: UpdateCardServiceImpl,
};

export const deleteCardService = {
  provide: TYPES.services.DeleteCardService,
  useClass: DeleteCardServiceImpl,
};

export const createCardApplication = {
  provide: TYPES.applications.CreateCardApplication,
  useClass: CreateCardApplicationImpl,
};

export const updateCardApplication = {
  provide: TYPES.applications.UpdateCardApplication,
  useClass: UpdateCardApplicationImpl,
};

export const deleteCardApplication = {
  provide: TYPES.applications.DeleteCardApplication,
  useClass: DeleteCardApplicationImpl,
};
