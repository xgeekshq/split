import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from '../../infrastructure/database/mongoose.module';
import BoardsModule from '../boards/boards.module';
import { CardsModule } from '../cards/cards.module';
import SocketModule from '../socket/socket.module';
import TeamsModule from '../teams/teams.module';
import {
	columnRepository,
	updateColumnApplication,
	updateColumnService
} from './columns.providers';
import ColumnsController from './controller/columns.controller';
import BoardUsersModule from '../boardusers/boardusers.module';
import TeamUsersModule from 'src/modules/teamusers/teamusers.module';

@Module({
	imports: [
		mongooseBoardModule,
		mongooseBoardUserModule,
		CardsModule,
		BoardsModule,
		BoardUsersModule,
		TeamsModule,
		TeamUsersModule,
		forwardRef(() => SocketModule)
	],
	controllers: [ColumnsController],
	providers: [updateColumnService, updateColumnApplication, columnRepository]
})
export class ColumnsModule {}
