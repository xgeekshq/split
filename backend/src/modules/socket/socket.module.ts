import { Global, Module, forwardRef } from '@nestjs/common';
import BoardsModule from '../boards/boards.module';
import SocketGateway from './gateway/socket.gateway';
import {
	afterServerPausedTimerSubscriber,
	afterServerSentTimerStateSubscriber,
	afterServerStartedTimerSubscriber,
	afterServerStoppedTimerSubscriber,
	afterServerUpdatedPhaseSubscriber,
	afterServerUpdatedTimeLeftSubscriber,
	afterServerUpdatedTimerDurationSubscriber
} from './socket.providers';

@Global()
@Module({
	imports: [forwardRef(() => BoardsModule)],
	providers: [
		SocketGateway,
		afterServerUpdatedTimerDurationSubscriber,
		afterServerPausedTimerSubscriber,
		afterServerStartedTimerSubscriber,
		afterServerStoppedTimerSubscriber,
		afterServerUpdatedTimeLeftSubscriber,
		afterServerSentTimerStateSubscriber,
		afterServerUpdatedPhaseSubscriber
	],
	exports: [SocketGateway]
})
export default class SocketModule {}
