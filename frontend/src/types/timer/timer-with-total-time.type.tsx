import { TimeDto } from '@/types/timer/time.dto';

export type TimeWithTotalTime = TimeDto & {
  total: number;
};
