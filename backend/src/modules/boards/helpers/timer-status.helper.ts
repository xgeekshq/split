import TimerStatusDto from 'src/libs/dto/timer-status.dto';

export default class TimerStatusHelper {
	private _status: TimerStatusDto = TimerStatusDto.STOPPED;
	get status(): TimerStatusDto {
		return this._status;
	}
	private set status(newStatus: TimerStatusDto) {
		this.previousStatus = this.status;
		this._status = newStatus;
	}

	private _previousStatus: TimerStatusDto = TimerStatusDto.STOPPED;
	get previousStatus(): TimerStatusDto {
		return this._previousStatus;
	}
	private set previousStatus(status: TimerStatusDto) {
		this._previousStatus = status;
	}

	run() {
		this.validateIfIsAlreadyRunning();
		this.status = TimerStatusDto.RUNNING;
	}

	pause() {
		this.validateIfIsNotRunning();
		this.status = TimerStatusDto.PAUSED;
	}

	stop() {
		this.status = TimerStatusDto.STOPPED;
	}

	get isRunning() {
		return this.status === TimerStatusDto.RUNNING;
	}

	get isPaused() {
		return this.status === TimerStatusDto.PAUSED;
	}

	get isStopped() {
		return this.status === TimerStatusDto.STOPPED;
	}

	private validateIfIsAlreadyRunning() {
		if (this.isRunning) {
			throw new Error('Timer is already running');
		}
	}

	private validateIfIsNotRunning() {
		if (!this.isRunning) {
			throw new Error('Timer is not running');
		}
	}
}
