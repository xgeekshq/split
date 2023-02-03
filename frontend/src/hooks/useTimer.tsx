import EmitEvent from '@/types/events/emit-event.type';
import ListenEvent from '@/types/events/listen-event.type';
import TimerStateDto from '@/types/timer/timer-state.dto';
import TimerStatus from '@/types/timer/timer-status';
import {
  BOARD_TIMER_SERVER_DURATION_UPDATED,
  BOARD_TIMER_SERVER_PAUSED,
  BOARD_TIMER_SERVER_SENT_TIMER_STATE,
  BOARD_TIMER_SERVER_STARTED,
  BOARD_TIMER_SERVER_STOPPED,
  BOARD_TIMER_SERVER_TIME_LEFT_UPDATED,
  BOARD_TIMER_USER_DURATION_UPDATED,
  BOARD_TIMER_USER_PAUSED,
  BOARD_TIMER_USER_REQUESTED_TIMER_STATE,
  BOARD_TIMER_USER_STARTED,
  BOARD_TIMER_USER_STOPPED,
  ONE_SECOND,
} from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';
import TimeDto from '../types/timer/time.dto';

export interface TimerInterface {
  minutes: string;
  seconds: string;

  isPaused(): boolean;
  isRunning(): boolean;

  incrementOneMinute(): void;
  decrementOneMinute(): void;
  incrementFiveSeconds(): void;
  decrementFiveSeconds(): void;

  startTimer(): void;
  pauseTimer(): void;
  stopTimer(): void;

  timerVariant: 'show' | 'hidden';
}

interface TimerProps {
  boardId: string;
  isAdmin: boolean;
  listenEvent: ListenEvent;
  emitEvent: EmitEvent;
}

const useTimer = ({ boardId, isAdmin, listenEvent, emitEvent }: TimerProps): TimerInterface => {
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);
  const [shallSendStatusUpdate, setShallSendStatusUpdate] = useState<boolean>(false);
  const [shallSendDurationUpdate, setShallSendDurationUpdate] = useState<boolean>(false);
  const [minutesLeft, setMinutesLeft] = useState<number>(minutes);
  const [secondsLeft, setSecondsLeft] = useState<number>(seconds);
  const [status, setStatus] = useState<TimerStatus>();
  const [timerVariant, setTimerVariant] = useState<'show' | 'hidden'>('show');

  const timeToString = useCallback((time: number) => (time < 10 ? '0' : '') + time, []);

  const isRunning = useCallback(() => status === TimerStatus.RUNNING, [status]);
  const isStopped = useCallback(() => status === TimerStatus.STOPPED, [status]);
  const isPaused = useCallback(() => status === TimerStatus.PAUSED, [status]);

  const startTimer = useCallback(() => {
    setStatus(TimerStatus.RUNNING);
    setShallSendStatusUpdate(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setStatus(TimerStatus.PAUSED);
    setShallSendStatusUpdate(true);
  }, []);

  const stopTimer = useCallback(() => {
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);
    setStatus(TimerStatus.STOPPED);
    setShallSendStatusUpdate(true);
  }, [minutes, seconds]);

  useEffect(() => {
    const updateDuration = (duration: TimeDto) => {
      if (duration) {
        setMinutes(duration.minutes || 0);
        setSeconds(duration.seconds || 0);
      }
    };
    const updateTimeLeft = (timeLeft: TimeDto) => {
      if (timeLeft) {
        setMinutesLeft(timeLeft.minutes || 0);
        setSecondsLeft(timeLeft.seconds || 0);
      }
    };

    listenEvent(BOARD_TIMER_SERVER_SENT_TIMER_STATE, (payload: TimerStateDto) => {
      updateDuration(payload.duration);
      updateTimeLeft(payload.timeLeft);

      if (payload.status) {
        setStatus(payload.status);
      }
    });

    listenEvent(BOARD_TIMER_SERVER_STARTED, (payload: TimerStateDto) => {
      updateDuration(payload.duration);
      updateTimeLeft(payload.timeLeft);
      setStatus(TimerStatus.RUNNING);
    });

    listenEvent(BOARD_TIMER_SERVER_PAUSED, (payload: TimerStateDto) => {
      updateDuration(payload.duration);
      updateTimeLeft(payload.timeLeft);
      setStatus(TimerStatus.PAUSED);
    });

    listenEvent(BOARD_TIMER_SERVER_STOPPED, (payload: TimerStateDto) => {
      updateDuration(payload.duration);
      updateTimeLeft(payload.timeLeft);
      setStatus(TimerStatus.STOPPED);
    });

    listenEvent(BOARD_TIMER_SERVER_TIME_LEFT_UPDATED, (payload: TimeDto) => {
      setMinutesLeft(payload.minutes);
      setSecondsLeft(payload.seconds);
    });

    listenEvent(BOARD_TIMER_SERVER_DURATION_UPDATED, (payload: TimeDto) => {
      setMinutes(payload.minutes);
      setSeconds(payload.seconds);
    });

    emitEvent(BOARD_TIMER_USER_REQUESTED_TIMER_STATE, { boardId });
  }, []);

  const decreaseOneMinute = useCallback(() => {
    setMinutesLeft((prevMin) => prevMin - 1);
    setSecondsLeft(59);
  }, []);
  const decreaseOneSecond = useCallback(() => setSecondsLeft((prevSec) => prevSec - 1), []);

  const toggleTimerVariant = useCallback(
    () => setTimerVariant((prev) => (prev === 'show' ? 'hidden' : 'show')),
    [],
  );

  useEffect(() => {
    let interval: any;

    if (isRunning() || isPaused()) {
      interval = setInterval(() => {
        if (isRunning()) {
          if (secondsLeft > 0) {
            decreaseOneSecond();
          } else if (minutesLeft > 0) {
            decreaseOneMinute();
          } else {
            stopTimer();
          }
        } else if (isPaused()) {
          toggleTimerVariant();
        }
      }, ONE_SECOND);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [status, minutesLeft, secondsLeft, timerVariant]);

  useEffect(() => {
    if (!isPaused()) {
      setTimerVariant('show');
    }

    if (isAdmin && shallSendStatusUpdate) {
      if (isRunning()) {
        emitEvent(BOARD_TIMER_USER_STARTED, { boardId, duration: { minutes, seconds } });
      } else if (isPaused()) {
        emitEvent(BOARD_TIMER_USER_PAUSED, {
          boardId,
          timeLeft: { minutes: minutesLeft, seconds: secondsLeft },
        });
      } else if (isStopped()) {
        emitEvent(BOARD_TIMER_USER_STOPPED, { boardId });
      }
      setShallSendStatusUpdate(false);
    }
  }, [status]);

  useEffect(() => {
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);
    if (isAdmin && shallSendDurationUpdate) {
      emitEvent(BOARD_TIMER_USER_DURATION_UPDATED, { boardId, duration: { minutes, seconds } });
      setShallSendDurationUpdate(false);
    }
  }, [minutes, seconds]);

  const incrementOneMinute = useCallback(() => {
    if (minutes < 59) {
      setMinutes((prevMin) => prevMin + 1);
    }
    setShallSendDurationUpdate(true);
  }, [minutes]);

  const decrementOneMinute = useCallback(() => {
    if (minutes > 0) {
      setMinutes((prevMin) => prevMin - 1);
    }
    setShallSendDurationUpdate(true);
  }, [minutes]);

  const incrementFiveSeconds = useCallback(() => {
    if (seconds < 55) {
      setSeconds((prevSec) => prevSec + 5);
    } else if (minutes < 59) {
      incrementOneMinute();
      setSeconds(0);
    }
    setShallSendDurationUpdate(true);
  }, [seconds, minutes]);

  const decrementFiveSeconds = useCallback(() => {
    if (seconds >= 5) {
      setSeconds((prevSec) => prevSec - 5);
    } else if (minutes > 0) {
      decrementOneMinute();
      setSeconds(55);
    }
    setShallSendDurationUpdate(true);
  }, [seconds, minutes]);

  return {
    minutes: timeToString(minutesLeft),
    seconds: timeToString(secondsLeft),

    isPaused,
    isRunning,

    incrementOneMinute,
    decrementOneMinute,
    incrementFiveSeconds,
    decrementFiveSeconds,

    startTimer,
    pauseTimer,
    stopTimer,

    timerVariant,
  };
};

export default useTimer;
