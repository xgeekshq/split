import { forwardRef, Module } from '@nestjs/common';

import {
	mongooseBoardModule,
	mongooseBoardUserModule
} from 'infrastructure/database/mongoose.module';
import SocketModule from 'modules/socket/socket.module';

import { CardsModule } from '../cards/cards.module';
import VotesController from './controller/votes.controller';
import {
	createVoteApplication,
	createVoteService,
	deleteVoteApplication,
	deleteVoteService
} from './votes.providers';

@Module({
	imports: [
		mongooseBoardModule,
		mongooseBoardUserModule,
		forwardRef(() => CardsModule),
		SocketModule
	],
	controllers: [VotesController],
	providers: [createVoteApplication, createVoteService, deleteVoteApplication, deleteVoteService],
	exports: [deleteVoteService]
})
export class VotesModule {}
