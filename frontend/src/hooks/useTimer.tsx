import { useCallback, useEffect, useRef, useState } from 'react';

import {
  BOARD_TIMER_JUMP_MINUTES,
  BOARD_TIMER_JUMP_SECONDS,
  BOARD_TIMER_MAX_MINUTES,
  BOARD_TIMER_MAX_SECONDS,
  BOARD_TIMER_MIN_MINUTES,
  BOARD_TIMER_MIN_SECONDS,
  BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH,
  BOARD_TIMER_SERVER_DURATION_UPDATED,
  BOARD_TIMER_SERVER_PAUSED,
  BOARD_TIMER_SERVER_SENT_TIMER_STATE,
  BOARD_TIMER_SERVER_STARTED,
  BOARD_TIMER_SERVER_STOPPED,
  BOARD_TIMER_SERVER_TIME_LEFT_UPDATED,
  BOARD_TIMER_START_MINUTES,
  BOARD_TIMER_START_SECONDS,
  BOARD_TIMER_START_TIME,
  BOARD_TIMER_USER_DURATION_UPDATED,
  BOARD_TIMER_USER_PAUSED,
  BOARD_TIMER_USER_REQUESTED_TIMER_STATE,
  BOARD_TIMER_USER_STARTED,
  BOARD_TIMER_USER_STOPPED,
  ONE_SECOND,
} from '@/constants';
import { TimeDto } from '@/types/timer/time.dto';
import { TimerProps } from '@/types/timer/timer-props.interface';
import { TimerStateDto } from '@/types/timer/timer-state.dto';
import { TimerStatus } from '@/types/timer/timer-status.enum';
import { TimeWithTotalTime } from '@/types/timer/timer-with-total-time.type';
import { inSeconds, timeToString } from '@/types/utils';

const useTimer = ({ boardId, isAdmin, listenEvent, emitEvent }: TimerProps) => {
  const [duration, setDuration] = useState<TimeWithTotalTime>(BOARD_TIMER_START_TIME);
  const [timeLeft, setTimeLeft] = useState<TimeWithTotalTime>(BOARD_TIMER_START_TIME);

  const [progressBarWidth, setProgressBarWidth] = useState<number>(
    BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH,
  );
  const [timerStatus, setTimerStatus] = useState<TimerStatus>();
  const [shallSendStatusUpdate, setShallSendStatusUpdate] = useState<boolean>(false);
  const [shallSendDurationUpdate, setShallSendDurationUpdate] = useState<boolean>(false);
  const [timerVariant, setTimerVariant] = useState<'show' | 'hidden'>('show');

  const timerCountdownRef = useRef<any>(null);

  const isTimerRunning = useCallback(() => timerStatus === TimerStatus.RUNNING, [timerStatus]);
  const isTimerStopped = useCallback(() => timerStatus === TimerStatus.STOPPED, [timerStatus]);
  const isTimerPaused = useCallback(() => timerStatus === TimerStatus.PAUSED, [timerStatus]);
  const isTimerActive = useCallback(
    () => isTimerRunning() || isTimerPaused(),
    [timerStatus, isTimerRunning, isTimerPaused],
  );

  const startTimer = useCallback(() => {
    setTimerStatus(TimerStatus.RUNNING);
    setShallSendStatusUpdate(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerStatus(TimerStatus.PAUSED);
    setShallSendStatusUpdate(true);
  }, []);

  const stopTimer = useCallback(() => {
    setTimeLeft(duration);
    setTimerStatus(TimerStatus.STOPPED);
    setShallSendStatusUpdate(true);
    setProgressBarWidth(BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH);
  }, [duration]);

  useEffect(() => {
    const updateDuration = (durationDto: TimeDto) => {
      if (durationDto) {
        const { minutes = BOARD_TIMER_START_MINUTES, seconds = BOARD_TIMER_START_SECONDS } =
          durationDto;
        setDuration({ minutes, seconds, total: inSeconds(minutes) + seconds });
      }
    };

    const updateTimeLeft = (timeLeftDto: TimeDto) => {
      if (timeLeftDto) {
        const { minutes = BOARD_TIMER_START_MINUTES, seconds = BOARD_TIMER_START_SECONDS } =
          timeLeftDto;
        setTimeLeft({ minutes, seconds, total: inSeconds(minutes) + seconds });
      }
    };
    const updateTimeLeftAndStatus = (timerStateDto: TimerStateDto) => {
      updateTimeLeft(timerStateDto.timeLeft);
      if (timerStateDto.status) {
        setTimerStatus(timerStateDto.status);
      }
    };
    const updateTimer = (timerStateDto: TimerStateDto) => {
      updateDuration(timerStateDto.duration);
      updateTimeLeftAndStatus(timerStateDto);
    };

    listenEvent(BOARD_TIMER_SERVER_SENT_TIMER_STATE, (timerStateDto: TimerStateDto) => {
      updateTimer(timerStateDto);
    });

    listenEvent(BOARD_TIMER_SERVER_STARTED, (timerStateDto: TimerStateDto) => {
      updateTimer({ ...timerStateDto, status: TimerStatus.RUNNING });
    });

    listenEvent(BOARD_TIMER_SERVER_PAUSED, (timerStateDto: TimerStateDto) => {
      updateTimeLeftAndStatus({ ...timerStateDto, status: TimerStatus.PAUSED });
    });

    listenEvent(BOARD_TIMER_SERVER_STOPPED, (timerStateDto: TimerStateDto) => {
      updateTimer({ ...timerStateDto, status: TimerStatus.STOPPED });
      setProgressBarWidth(BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH);
    });

    listenEvent(BOARD_TIMER_SERVER_TIME_LEFT_UPDATED, (timeLeftDto: TimeDto) => {
      updateTimeLeft(timeLeftDto);
    });

    listenEvent(BOARD_TIMER_SERVER_DURATION_UPDATED, (durationDto: TimeDto) => {
      updateDuration(durationDto);
    });

    emitEvent(BOARD_TIMER_USER_REQUESTED_TIMER_STATE, { boardId });
  }, []);

  const updateTimeLeft = useCallback(() => {
    if (timeLeft.seconds > 1) {
      setTimeLeft((prev: TimeWithTotalTime) => ({
        minutes: prev.minutes,
        seconds: prev.seconds - 1,
        total: prev.total - 1,
      }));
    } else if (timeLeft.minutes > 0) {
      setTimeLeft((prev: TimeWithTotalTime) => ({
        minutes: prev.minutes - 1,
        seconds: 59,
        total: prev.total - 1,
      }));
    } else {
      setTimeLeft({ minutes: 0, seconds: 0, total: 0 });
    }
  }, [timeLeft]);

  const toggleTimerVariant = useCallback(
    () => setTimerVariant((prev: string) => (prev === 'show' ? 'hidden' : 'show')),
    [],
  );

  const updateProgressBarWidth = useCallback(() => {
    if (isTimerActive() && timeLeft.total > 0) {
      const progressPercentage = 1 - timeLeft.total / duration.total;
      const progressBarWidthRan = Math.round(
        progressPercentage * BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH,
      );
      const decreasedProgressBarWidth =
        BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH - progressBarWidthRan;

      setProgressBarWidth(decreasedProgressBarWidth);
    } else {
      setProgressBarWidth(BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH);
    }
  }, [timeLeft, duration, isTimerRunning, isTimerPaused, timerStatus]);

  useEffect(() => {
    if (isTimerActive()) {
      timerCountdownRef.current = setInterval(() => {
        if (isTimerPaused()) {
          toggleTimerVariant();
        } else if (isTimerRunning() && timeLeft.total > 0) {
          updateTimeLeft();
          updateProgressBarWidth();
        } else {
          stopTimer();
          clearInterval(timerCountdownRef.current);
        }
      }, ONE_SECOND);
    } else if (timerCountdownRef.current) {
      clearInterval(timerCountdownRef.current);
    }

    return () => clearInterval(timerCountdownRef.current);
  }, [timeLeft, timerVariant, isTimerRunning, isTimerPaused, isTimerStopped, timerStatus]);

  useEffect(() => {
    if (!isTimerPaused()) {
      setTimerVariant('show');
    }

    if (isAdmin && shallSendStatusUpdate) {
      setShallSendStatusUpdate(false);

      if (isTimerRunning()) {
        emitEvent(BOARD_TIMER_USER_STARTED, { boardId, duration });
      } else if (isTimerPaused()) {
        emitEvent(BOARD_TIMER_USER_PAUSED, { boardId, timeLeft });
      } else if (isTimerStopped()) {
        emitEvent(BOARD_TIMER_USER_STOPPED, { boardId });
      }
    }
  }, [timerStatus]);

  useEffect(() => {
    if (shallSendDurationUpdate || isTimerStopped()) {
      setTimeLeft(duration);
    }

    if (shallSendDurationUpdate && isAdmin) {
      setShallSendDurationUpdate(false);
      emitEvent(BOARD_TIMER_USER_DURATION_UPDATED, { boardId, duration });
    }
  }, [duration]);

  const incrementDurationMinutes = useCallback(() => {
    if (duration.minutes < BOARD_TIMER_MAX_MINUTES) {
      setShallSendDurationUpdate(true);
      setDuration((prev: TimeWithTotalTime) => ({
        ...prev,
        minutes: prev.minutes + BOARD_TIMER_JUMP_MINUTES,
        total: prev.total + inSeconds(BOARD_TIMER_JUMP_MINUTES),
      }));
    }
  }, [duration]);

  const decrementDurationMinutes = useCallback(() => {
    if (duration.minutes > BOARD_TIMER_MIN_MINUTES) {
      setShallSendDurationUpdate(true);
      setDuration((prev: TimeWithTotalTime) => ({
        minutes:
          prev.minutes - BOARD_TIMER_JUMP_MINUTES > BOARD_TIMER_MIN_MINUTES
            ? prev.minutes - BOARD_TIMER_JUMP_MINUTES
            : BOARD_TIMER_MIN_MINUTES,
        seconds:
          prev.minutes - BOARD_TIMER_JUMP_MINUTES === BOARD_TIMER_MIN_MINUTES &&
          prev.seconds <= BOARD_TIMER_MIN_SECONDS
            ? BOARD_TIMER_MIN_SECONDS
            : prev.seconds,
        total: prev.total - inSeconds(BOARD_TIMER_JUMP_MINUTES),
      }));
    }
  }, [duration]);

  const incrementDurationSeconds = useCallback(() => {
    if (duration.seconds < BOARD_TIMER_MAX_SECONDS) {
      setShallSendDurationUpdate(true);
      setDuration((prev: TimeWithTotalTime) => ({
        ...prev,
        seconds: prev.seconds + BOARD_TIMER_JUMP_SECONDS,
        total: prev.total + BOARD_TIMER_JUMP_SECONDS,
      }));
    } else if (duration.minutes < BOARD_TIMER_MAX_MINUTES) {
      setShallSendDurationUpdate(true);
      setDuration((prev: TimeWithTotalTime) => ({
        minutes: prev.minutes + BOARD_TIMER_JUMP_MINUTES,
        seconds: 0,
        total: prev.total + BOARD_TIMER_JUMP_SECONDS,
      }));
    }
  }, [duration]);

  const decrementDurationSeconds = useCallback(() => {
    if (
      duration.minutes === BOARD_TIMER_MIN_MINUTES &&
      duration.seconds === BOARD_TIMER_MIN_SECONDS
    ) {
      setShallSendDurationUpdate(true);
      setDuration((prev: TimeWithTotalTime) => ({
        ...prev,
        seconds: BOARD_TIMER_MIN_SECONDS,
        total: BOARD_TIMER_MIN_SECONDS,
      }));
    } else if (duration.minutes >= BOARD_TIMER_MIN_MINUTES) {
      if (duration.seconds === BOARD_TIMER_JUMP_SECONDS) {
        setShallSendDurationUpdate(true);
        setDuration((prev: TimeWithTotalTime) => ({
          ...prev,
          seconds: 0,
          total: prev.total - BOARD_TIMER_JUMP_SECONDS,
        }));
      } else if (duration.seconds === 0) {
        setShallSendDurationUpdate(true);
        setDuration((prev: TimeWithTotalTime) => ({
          minutes:
            prev.minutes - BOARD_TIMER_JUMP_MINUTES >= BOARD_TIMER_MIN_MINUTES
              ? prev.minutes - BOARD_TIMER_JUMP_MINUTES
              : BOARD_TIMER_MIN_MINUTES,
          seconds: 60 - BOARD_TIMER_JUMP_SECONDS,
          total: prev.total - BOARD_TIMER_JUMP_SECONDS,
        }));
      } else {
        setShallSendDurationUpdate(true);
        setDuration((prev: TimeWithTotalTime) => ({
          ...prev,
          seconds: prev.seconds - BOARD_TIMER_JUMP_SECONDS,
          total: prev.total - BOARD_TIMER_JUMP_SECONDS,
        }));
      }
    }
  }, [duration]);

  return {
    minutes: timeToString(timeLeft.minutes),
    seconds: timeToString(timeLeft.seconds),

    isTimerPaused,
    isTimerRunning,

    incrementDurationMinutes,
    decrementDurationMinutes,
    incrementDurationSeconds,
    decrementDurationSeconds,

    startTimer,
    pauseTimer,
    stopTimer,

    timerVariant,
    progressBarWidth: `${progressBarWidth}px`,
  };
};

export default useTimer;
