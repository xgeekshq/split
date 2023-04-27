import AfterServerPausedTimerSubscriber from 'src/modules/socket/subscribers/after-server-paused-timer.subscriber';
import AfterServerSentTimerStateSubscriber from 'src/modules/socket/subscribers/after-server-sent-timer-state.subscriber';
import AfterServerStaredTimerSubscriber from 'src/modules/socket/subscribers/after-server-started-timer.subscriber';
import AfterServerStoppedTimerSubscriber from 'src/modules/socket/subscribers/after-server-stopped-timer.subscriber';
import AfterServerUpdatedTimeLeftSubscriber from 'src/modules/socket/subscribers/after-server-updated-time-left.subscriber';
import AfterServerUpdatedTimerDurationSubscriber from 'src/modules/socket/subscribers/after-server-updated-timer-duration.subscriber';
import {
	AFTER_SERVER_PAUSED_TIMER_SUBSCRIBER,
	AFTER_SERVER_SENT_TIMER_STATE_SUBSCRIBER,
	AFTER_SERVER_STARTED_TIMER_SUBSCRIBER,
	AFTER_SERVER_STOPPED_TIMER_SUBSCRIBER,
	AFTER_SERVER_UPDATED_PHASE_SUBSCRIBER,
	AFTER_SERVER_UPDATED_TIME_DURATION_SUBSCRIBER,
	AFTER_SERVER_UPDATED_TIME_LEFT_SUBSCRIBER
} from './constants';
import AfterServerUpdatedPhaseSubscriber from './subscribers/after-server-updated-phase.subscriber';

export const afterServerUpdatedTimerDurationSubscriber = {
	provide: AFTER_SERVER_UPDATED_TIME_DURATION_SUBSCRIBER,
	useClass: AfterServerUpdatedTimerDurationSubscriber
};

export const afterServerPausedTimerSubscriber = {
	provide: AFTER_SERVER_PAUSED_TIMER_SUBSCRIBER,
	useClass: AfterServerPausedTimerSubscriber
};

export const afterServerStartedTimerSubscriber = {
	provide: AFTER_SERVER_STARTED_TIMER_SUBSCRIBER,
	useClass: AfterServerStaredTimerSubscriber
};

export const afterServerStoppedTimerSubscriber = {
	provide: AFTER_SERVER_STOPPED_TIMER_SUBSCRIBER,
	useClass: AfterServerStoppedTimerSubscriber
};

export const afterServerUpdatedTimeLeftSubscriber = {
	provide: AFTER_SERVER_UPDATED_TIME_LEFT_SUBSCRIBER,
	useClass: AfterServerUpdatedTimeLeftSubscriber
};

export const afterServerSentTimerStateSubscriber = {
	provide: AFTER_SERVER_SENT_TIMER_STATE_SUBSCRIBER,
	useClass: AfterServerSentTimerStateSubscriber
};

export const afterServerUpdatedPhaseSubscriber = {
	provide: AFTER_SERVER_UPDATED_PHASE_SUBSCRIBER,
	useClass: AfterServerUpdatedPhaseSubscriber
};
