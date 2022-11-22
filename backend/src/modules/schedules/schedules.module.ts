import { forwardRef, Module } from '@nestjs/common';

import { mongooseSchedulesModule } from 'infrastructure/database/mongoose.module';
import BoardsModule from 'modules/boards/boards.module';

import { createSchedulesService, deleteSchedulesService } from './schedules.providers';

@Module({
	imports: [mongooseSchedulesModule, forwardRef(() => BoardsModule)],
	providers: [createSchedulesService, deleteSchedulesService],
	exports: [createSchedulesService, deleteSchedulesService]
})
export class SchedulesModule {}
