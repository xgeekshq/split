import AfterServerPausedTimerSubscriber from 'src/modules/socket/subscribers/after-server-paused-timer.subscriber';
import AfterServerSentTimerStateSubscriber from 'src/modules/socket/subscribers/after-server-sent-timer-state.subscriber';
import AfterServerStaredTimerSubscriber from 'src/modules/socket/subscribers/after-server-started-timer.subscriber';
import AfterServerStoppedTimerSubscriber from 'src/modules/socket/subscribers/after-server-stopped-timer.subscriber';
import AfterServerUpdatedTimeLeftSubscriber from 'src/modules/socket/subscribers/after-server-updated-time-left.subscriber';
import AfterServerUpdatedTimerDurationSubscriber from 'src/modules/socket/subscribers/after-server-updated-timer-duration.subscriber';
import { TYPES } from './interfaces/types';

export const afterServerUpdatedTimerDurationSubscriber = {
	provide: TYPES.subscribers.AfterServerUpdatedTimerDurationSubscriber,
	useClass: AfterServerUpdatedTimerDurationSubscriber
};

export const afterServerPausedTimerSubscriber = {
	provide: TYPES.subscribers.AfterServerPausedTimerSubscriber,
	useClass: AfterServerPausedTimerSubscriber
};

export const afterServerStaredTimerSubscriber = {
	provide: TYPES.subscribers.AfterServerStaredTimerSubscriber,
	useClass: AfterServerStaredTimerSubscriber
};

export const afterServerStoppedTimerSubscriber = {
	provide: TYPES.subscribers.AfterServerStoppedTimerSubscriber,
	useClass: AfterServerStoppedTimerSubscriber
};

export const afterServerUpdatedTimeLeftSubscriber = {
	provide: TYPES.subscribers.AfterServerUpdatedTimeLeftSubscriber,
	useClass: AfterServerUpdatedTimeLeftSubscriber
};

export const afterServerSentTimerStateSubscriber = {
	provide: TYPES.subscribers.AfterServerSentTimerStateSubscriber,
	useClass: AfterServerSentTimerStateSubscriber
};
