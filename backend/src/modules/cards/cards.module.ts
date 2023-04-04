import { Module, forwardRef } from '@nestjs/common';
import { mongooseBoardModule } from '../../infrastructure/database/mongoose.module';
import BoardUsersModule from '../boardUsers/boardusers.module';
import SocketModule from '../socket/socket.module';
import { VotesModule } from '../votes/votes.module';
import {
	cardRepository,
	createCardUseCase,
	deleteCardUseCase,
	deleteFromCardGroupUseCase,
	getCardService,
	mergeCardUseCase,
	unmergeCardUseCase,
	updateCardApplication,
	updateCardService
} from './cards.providers';
import CardsController from './controller/cards.controller';

@Module({
	imports: [
		mongooseBoardModule,
		forwardRef(() => BoardUsersModule),
		forwardRef(() => SocketModule),
		forwardRef(() => VotesModule)
	],
	controllers: [CardsController],
	providers: [
		updateCardService,
		getCardService,
		updateCardService,
		updateCardApplication,
		cardRepository,
		createCardUseCase,
		mergeCardUseCase,
		deleteCardUseCase,
		deleteFromCardGroupUseCase,
		unmergeCardUseCase
	],
	exports: [getCardService]
})
export class CardsModule {}
