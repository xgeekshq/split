import { TimeDto } from './time.dto';

export type TimeWithTotalTime = TimeDto & {
  total: number;
};
