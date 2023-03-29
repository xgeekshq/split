import EventCallback from '@/types/events/event-callback.type';

export type ListenEvent = (eventName: string, callback: EventCallback) => void;
