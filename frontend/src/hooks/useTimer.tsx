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
  const [isFirstRender, setFirstRender] = useState<boolean>(true);
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
  }, []);

  const pauseTimer = useCallback(() => {
    setStatus(TimerStatus.PAUSED);
  }, []);

  const stopTimer = useCallback(() => {
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);
    setStatus(TimerStatus.STOPPED);
  }, [minutes, seconds]);

  useEffect(() => {
    listenEvent(BOARD_TIMER_SERVER_SENT_TIMER_STATE, (payload: TimerStateDto) => {
      if (!payload) {
        return;
      }
      const { duration, timeLeft } = payload;
      if (duration && duration.minutes !== minutes && duration.seconds !== seconds) {
        setMinutes(duration.minutes);
        setSeconds(duration.seconds);
      }
      if (timeLeft && timeLeft.minutes !== minutesLeft && timeLeft.seconds !== secondsLeft) {
        setMinutesLeft(timeLeft.minutes);
        setSecondsLeft(timeLeft.seconds);
      }
      if (payload.status && payload.status !== status) {
        setStatus(payload.status);
      }
    });

    listenEvent(BOARD_TIMER_SERVER_STARTED, (payload: TimeDto) => {
      setMinutes(payload.minutes);
      setSeconds(payload.seconds);
      setMinutesLeft(payload.minutes);
      setSecondsLeft(payload.seconds);
      setStatus(TimerStatus.RUNNING);
    });

    listenEvent(BOARD_TIMER_SERVER_PAUSED, (payload: TimeDto) => {
      setMinutesLeft(payload.minutes);
      setSecondsLeft(payload.seconds);
      pauseTimer();
    });

    listenEvent(BOARD_TIMER_SERVER_STOPPED, (payload: TimeDto) => {
      setMinutes(payload.minutes);
      setSeconds(payload.seconds);
      setMinutesLeft(payload.minutes);
      setSecondsLeft(payload.seconds);
      stopTimer();
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

    if (isAdmin) {
      if (isRunning()) {
        emitEvent(BOARD_TIMER_USER_STARTED, { boardId, duration: { minutes, seconds } });
      } else if (isPaused()) {
        emitEvent(BOARD_TIMER_USER_PAUSED, {
          boardId,
          timeLeft: { minutes: minutesLeft, seconds: secondsLeft },
        });
      } else if (isStopped()) {
        emitEvent(BOARD_TIMER_USER_STOPPED, { boardId, duration: { minutes, seconds } });
      }
    }
  }, [status]);

  useEffect(() => {
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);
    if (isAdmin && !isFirstRender) {
      emitEvent(BOARD_TIMER_USER_DURATION_UPDATED, { boardId, duration: { minutes, seconds } });
    } else {
      setFirstRender(false);
    }
  }, [minutes, seconds]);

  const incrementOneMinute = useCallback(() => {
    if (minutes < 59) {
      setMinutes((prevMin) => prevMin + 1);
    }
  }, [minutes]);

  const decrementOneMinute = useCallback(() => {
    if (minutes > 0) {
      setMinutes((prevMin) => prevMin - 1);
    }
  }, [minutes]);

  const incrementFiveSeconds = useCallback(() => {
    if (seconds < 55) {
      setSeconds((prevSec) => prevSec + 5);
    } else if (minutes < 59) {
      incrementOneMinute();
      setSeconds(0);
    }
  }, [seconds, minutes]);

  const decrementFiveSeconds = useCallback(() => {
    if (seconds >= 5) {
      setSeconds((prevSec) => prevSec - 5);
    } else if (minutes > 0) {
      decrementOneMinute();
      setSeconds(55);
    }
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
