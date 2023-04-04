import BoardsModule from 'src/modules/boards/boards.module';
import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from 'src/infrastructure/database/mongoose.module';
import SocketModule from 'src/modules/socket/socket.module';
import { CardsModule } from '../cards/cards.module';
import VotesController from './controller/votes.controller';
import {
	createCardItemVoteUseCase,
	createVoteApplication,
	createVoteService,
	deleteVoteApplication,
	deleteVoteService,
	voteRepository
} from './votes.providers';
import BoardUsersModule from '../boardUsers/boardusers.module';

@Module({
	imports: [
		mongooseBoardModule,
		mongooseBoardUserModule,
		forwardRef(() => BoardsModule),
		forwardRef(() => BoardUsersModule),
		forwardRef(() => CardsModule),
		SocketModule
	],
	controllers: [VotesController],
	providers: [
		createVoteApplication,
		createCardItemVoteUseCase,
		createVoteService,
		deleteVoteApplication,
		deleteVoteService,
		voteRepository
	],
	exports: [deleteVoteService]
})
export class VotesModule {}
