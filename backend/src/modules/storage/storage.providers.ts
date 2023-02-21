import { TYPES } from './interfaces/types';
import { StorageService } from './services/storage.service';

export const storageService = {
	provide: TYPES.services.StorageService,
	useClass: StorageService
};
