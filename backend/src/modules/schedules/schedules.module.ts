import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseSchedulesModule
} from 'src/infrastructure/database/mongoose.module';
import BoardsModule from 'src/modules/boards/boards.module';
import { CommunicationModule } from 'src/modules/communication/communication.module';
import { boardRepository } from '../boards/boards.providers';
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
	providers: [createSchedulesService, deleteSchedulesService, boardRepository, scheduleRepository],
	exports: [createSchedulesService, deleteSchedulesService]
})
export class SchedulesModule {}
