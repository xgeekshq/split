import BoardTimerDto from 'src/modules/common/dtos/board-timer.dto';
import TimeDto from 'src/modules/common/dtos/time.dto';
import TimerStatusDto from 'src/modules/common/dtos/timer-status.dto';

export default interface BoardTimerStateDto extends BoardTimerDto {
	status: TimerStatusDto | null;
	duration: TimeDto | null;
	timeLeft: TimeDto | null;
}
