import {
	BOARD_TIMER_MINUTES_DEFAULT,
	BOARD_TIMER_SECONDS_DEFAULT,
	ONE_SECOND
} from 'src/libs/constants/timer';
import TimeDto from 'src/libs/dto/time.dto';
import TimerStatusDto from 'src/libs/dto/timer-status.dto';
import TimerStatusHelper from 'src/modules/boards/helpers/timer-status.helper';

type TimeLeftUpdateCallback = (timeLeft: TimeDto) => void;
type TimerExpiredCallback = () => void;
type TimerStateType = { status: TimerStatusDto; duration: TimeDto; timeLeft: TimeDto };

export default class TimerHelper {
	private readonly statusHelper: TimerStatusHelper = new TimerStatusHelper();
	private _duration: TimeDto;
	private _timeLeft: TimeDto;
	private interval: any;
	private timerSyncInterval: number;
	private onTimerSyncCallback: TimeLeftUpdateCallback;
	private onExpiredCallback: TimerExpiredCallback;

	constructor() {
		this._duration = {
			minutes: BOARD_TIMER_MINUTES_DEFAULT,
			seconds: BOARD_TIMER_SECONDS_DEFAULT
		};
		this._timeLeft = this._duration;
	}

	get state(): TimerStateType {
		return { status: this.statusHelper.status, duration: this._duration, timeLeft: this.timeLeft };
	}

	get isRunning(): boolean {
		return this.statusHelper.isRunning;
	}

	get isStopped(): boolean {
		return this.statusHelper.isStopped;
	}

	setDuration(duration: TimeDto) {
		this._duration = duration;
	}

	get duration(): TimeDto {
		return this._duration;
	}

	start(duration: TimeDto) {
		this.setDuration(duration);
		this._timeLeft = duration;
		this.runTimer();
	}

	get timeLeft(): TimeDto {
		return this._timeLeft;
	}

	pause() {
		this.statusHelper.pause();
		this.clearInterval();
	}

	stop() {
		this.clearInterval();
		this._timeLeft = this.duration;
		this.statusHelper.stop();
	}

	private clearInterval() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	resume() {
		this.runTimer();
	}

	private runTimer() {
		this.statusHelper.run();
		this.interval = setInterval(() => {
			if (this.statusHelper.isRunning) {
				this.updateTimeLeft();
				this.handleTimeUpdated();
			}
		}, ONE_SECOND);
	}

	private updateTimeLeft() {
		if (this._timeLeft.seconds > 0) {
			this._timeLeft.seconds--;
		} else if (this._timeLeft.minutes > 0) {
			this._timeLeft.minutes--;
			this._timeLeft.seconds = 59;
		} else {
			this.onExpired();
		}
	}

	setTimerSyncIntervalAndCallback(interval = 15, callback: TimeLeftUpdateCallback) {
		this.timerSyncInterval = interval;
		this.onTimerSyncCallback = callback;
	}

	private handleTimeUpdated() {
		if (this.onTimerSyncCallback && this._timeLeft.seconds % this.timerSyncInterval === 0) {
			this.onTimerSyncCallback(this._timeLeft);
		}
	}

	setOnTimeExpiredCallback(callback: TimerExpiredCallback) {
		this.onExpiredCallback = callback;
	}

	private onExpired() {
		this.stop();

		if (this.onExpiredCallback) {
			this.onExpiredCallback();
		}
	}
}
