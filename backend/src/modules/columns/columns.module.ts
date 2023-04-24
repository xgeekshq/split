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
	deleteCardsFromColumnUseCase,
	updateColumnService,
	updateColumnUseCase
} from './columns.providers';
import ColumnsController from './controller/columns.controller';
import BoardUsersModule from '../boardUsers/boardusers.module';
import TeamUsersModule from 'src/modules/teamUsers/teamusers.module';
import { VotesModule } from '../votes/votes.module';

@Module({
	imports: [
		mongooseBoardModule,
		mongooseBoardUserModule,
		CardsModule,
		BoardsModule,
		BoardUsersModule,
		TeamsModule,
		TeamUsersModule,
		forwardRef(() => SocketModule),
		forwardRef(() => VotesModule)
	],
	controllers: [ColumnsController],
	providers: [
		updateColumnService,
		columnRepository,
		updateColumnUseCase,
		deleteCardsFromColumnUseCase
	]
})
export class ColumnsModule {}
