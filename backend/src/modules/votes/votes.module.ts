import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from 'src/infrastructure/database/mongoose.module';
import SocketModule from 'src/modules/socket/socket.module';
import { CardsModule } from '../cards/cards.module';
import VotesController from './controller/votes.controller';
import {
	createVoteApplication,
	createVoteService,
	deleteVoteApplication,
	deleteVoteService,
	votesBoardRepository,
	votesBoardUserRepository
} from './votes.providers';

@Module({
	imports: [
		mongooseBoardModule,
		mongooseBoardUserModule,
		forwardRef(() => CardsModule),
		SocketModule
	],
	controllers: [VotesController],
	providers: [
		createVoteApplication,
		createVoteService,
		deleteVoteApplication,
		deleteVoteService,
		votesBoardRepository,
		votesBoardUserRepository
	],
	exports: [deleteVoteService]
})
export class VotesModule {}
