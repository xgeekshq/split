import { Module, forwardRef } from '@nestjs/common';
import { mongooseBoardModule } from '../../infrastructure/database/mongoose.module';
import SocketModule from '../socket/socket.module';
import { VotesModule } from '../votes/votes.module';
import {
	cardRepository,
	createCardUseCase,
	deleteCardApplication,
	deleteCardService,
	getCardService,
	mergeCardUseCase,
	unmergeCardApplication,
	unmergeCardService,
	updateCardApplication,
	updateCardService
} from './cards.providers';
import CardsController from './controller/cards.controller';

@Module({
	imports: [mongooseBoardModule, forwardRef(() => SocketModule), forwardRef(() => VotesModule)],
	controllers: [CardsController],
	providers: [
		updateCardService,
		getCardService,
		deleteCardService,
		updateCardService,
		unmergeCardService,
		updateCardApplication,
		deleteCardApplication,
		unmergeCardApplication,
		cardRepository,
		createCardUseCase,
		mergeCardUseCase
	],
	exports: [getCardService, deleteCardService]
})
export class CardsModule {}
