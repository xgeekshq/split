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
	updateCardGroupTextUseCase,
	updateCardPositionUseCase,
	updateCardTextUseCase
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
		getCardService,
		cardRepository,
		createCardUseCase,
		unmergeCardUseCase,
		mergeCardUseCase,
		updateCardPositionUseCase,
		updateCardTextUseCase,
		updateCardGroupTextUseCase,
		deleteCardUseCase,
		deleteFromCardGroupUseCase
	],
	exports: [getCardService]
})
export class CardsModule {}
