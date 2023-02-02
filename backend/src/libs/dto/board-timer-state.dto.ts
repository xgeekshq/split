import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import TimeDto from 'src/libs/dto/time.dto';
import TimerStatusDto from 'src/modules/common/dtos/timer-status.dto';

export default interface BoardTimerStateDto extends BoardTimerDto {
	status: TimerStatusDto | null;
	duration: TimeDto | null;
	timeLeft: TimeDto | null;
}
