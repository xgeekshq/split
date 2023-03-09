import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseSchedulesModule
} from 'src/infrastructure/database/mongoose.module';
import BoardsModule from 'src/modules/boards/boards.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import {
	createSchedulesService,
	deleteSchedulesService,
	scheduleRepository
} from './schedules.providers';

@Module({
	imports: [
		mongooseSchedulesModule,
		mongooseBoardModule,
		forwardRef(() => BoardsModule),
		CommunicationModule
	],
	providers: [createSchedulesService, deleteSchedulesService, scheduleRepository],
	exports: [createSchedulesService, deleteSchedulesService]
})
export class SchedulesModule {}
