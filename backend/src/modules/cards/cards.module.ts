import { Module, forwardRef } from '@nestjs/common';
import { mongooseBoardModule } from '../../infrastructure/database/mongoose.module';
import SocketModule from '../socket/socket.module';
import { VotesModule } from '../votes/votes.module';
import {
	cardRepository,
	creacteCardUseCase,
	createCardApplication,
	createCardService,
	deleteCardApplication,
	deleteCardService,
	getCardService,
	mergeCardApplication,
	mergeCardService,
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
		createCardService,
		updateCardService,
		getCardService,
		deleteCardService,
		updateCardService,
		mergeCardService,
		unmergeCardService,
		createCardApplication,
		updateCardApplication,
		deleteCardApplication,
		mergeCardApplication,
		unmergeCardApplication,
		cardRepository,
		creacteCardUseCase
	],
	exports: [getCardService, deleteCardService]
})
export class CardsModule {}
