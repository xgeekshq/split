import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from '../../infrastructure/database/mongoose.module';
import BoardsModule from '../boards/boards.module';
import { boardRepository } from '../boards/boards.providers';
import { CardsModule } from '../cards/cards.module';
import SocketModule from '../socket/socket.module';
import TeamsModule from '../teams/teams.module';
import {
	columnRepository,
	updateColumnApplication,
	updateColumnService
} from './columns.providers';
import ColumnsController from './controller/columns.controller';

@Module({
	imports: [
		mongooseBoardModule,
		mongooseBoardUserModule,
		CardsModule,
		BoardsModule,
		TeamsModule,
		forwardRef(() => SocketModule)
	],
	controllers: [ColumnsController],
	providers: [updateColumnService, updateColumnApplication, columnRepository, boardRepository]
})
export class ColumnsModule {}
