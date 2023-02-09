import EventCallback from '@/types/events/event-callback.type';

type ListenEvent = (eventName: string, callback: EventCallback) => void;

export default ListenEvent;
