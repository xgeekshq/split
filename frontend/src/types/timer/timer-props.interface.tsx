import { EmitEvent } from '@/types/events/emit-event.type';
import { ListenEvent } from '@/types/events/listen-event.type';

export interface TimerProps {
  boardId: string;
  isAdmin: boolean;
  listenEvent: ListenEvent;
  emitEvent: EmitEvent;
}
