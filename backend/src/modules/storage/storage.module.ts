import { Logger, Module } from '@nestjs/common';
import { storageService } from './storage.providers';

@Module({
	providers: [storageService, Logger],
	exports: [storageService]
})
export class StorageModule {}
