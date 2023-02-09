import TimeDto from '@/types/timer/time.dto';
import TimerStatus from '@/types/timer/timer-status';

export default interface TimerStateDto {
  status: TimerStatus;
  previousStatus: TimerStatus;
  duration: TimeDto;
  timeLeft: TimeDto;
}
