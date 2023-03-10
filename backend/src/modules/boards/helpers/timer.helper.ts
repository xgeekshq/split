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
type CleanTimerCallback = () => void;
type TimerStateType = {
	status: TimerStatusDto;
	duration: TimeDto;
	timeLeft: TimeDto;
};

const fifteenSeconds = 15;

const oneHour = 1 * 60 * 60 * 1000;

export default class TimerHelper {
	private readonly statusHelper: TimerStatusHelper = new TimerStatusHelper();

	private _duration: TimeDto;
	get duration(): TimeDto {
		return this._duration;
	}
	setDuration(duration: TimeDto) {
		this._duration = { ...duration };
	}

	private _timeLeft: TimeDto;
	get timeLeft(): TimeDto {
		return this._timeLeft;
	}
	setTimeLeft(timeLeft: TimeDto) {
		this._timeLeft = timeLeft;
	}

	private interval: any;
	private timeOut: any;
	private timerSyncInterval: number;
	private onTimerSyncCallback: TimeLeftUpdateCallback;
	private onExpiredCallback: TimerExpiredCallback;

	constructor() {
		this.setDuration({
			minutes: BOARD_TIMER_MINUTES_DEFAULT,
			seconds: BOARD_TIMER_SECONDS_DEFAULT
		});
		this.setTimeLeft(this.duration);
	}

	get state(): TimerStateType {
		return {
			status: this.statusHelper.status,
			duration: this._duration,
			timeLeft: this.timeLeft
		};
	}

	get isRunning(): boolean {
		return this.statusHelper.isRunning;
	}

	get isStopped(): boolean {
		return this.statusHelper.isStopped;
	}

	get isPaused(): boolean {
		return this.statusHelper.isPaused;
	}

	start(duration: TimeDto) {
		this.setDuration(duration);
		this.setTimeLeft(duration);
		this.runTimer();
	}

	pause() {
		this.statusHelper.pause();
		this.clearInterval();
	}

	stop() {
		this.setTimeLeft(this.duration);
		this.clearInterval();
		this.statusHelper.stop();
	}

	resume() {
		this.runTimer();
	}

	private clearInterval() {
		if (this.interval) {
			clearInterval(this.interval);
		}
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

	setTimerSyncIntervalAndCallback(interval = fifteenSeconds, callback: TimeLeftUpdateCallback) {
		this.timerSyncInterval = interval;
		this.onTimerSyncCallback = callback;
	}

	setCleanTimerCallback(time = oneHour, callback: CleanTimerCallback) {
		this.timeOut = setTimeout(() => {
			callback();
			clearTimeout(this.timeOut);
		}, time);
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
