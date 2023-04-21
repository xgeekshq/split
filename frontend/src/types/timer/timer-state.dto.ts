import { TimerStatus } from '@/enums/timer/status';
import { TimeDto } from '@/types/timer/time.dto';

export interface TimerStateDto {
  status: TimerStatus;
  duration: TimeDto;
  timeLeft: TimeDto;
}
