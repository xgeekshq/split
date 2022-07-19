import { forwardRef, Module } from '@nestjs/common';

import { mongooseSchedulesModule } from 'infrastructure/database/mongoose.module';
import BoardsModule from 'modules/boards/boards.module';

import { createSchedulesService } from './schedules.providers';

@Module({
	imports: [mongooseSchedulesModule, forwardRef(() => BoardsModule)],
	providers: [createSchedulesService],
	exports: [createSchedulesService]
})
export class SchedulesModule {}
