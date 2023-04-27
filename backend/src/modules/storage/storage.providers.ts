import { STORAGE_SERVICE } from './constants';
import { StorageService } from './services/storage.service';

export const storageService = {
	provide: STORAGE_SERVICE,
	useClass: StorageService
};
