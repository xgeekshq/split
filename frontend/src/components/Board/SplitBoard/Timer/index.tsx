import {
  ClockPanel,
  ControlPanel,
  Line,
  TextControlButtonContainer,
  TimeButtonText,
  TimePanel,
  TimerContainer,
} from '@/components/Board/SplitBoard/Timer/styles';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
import { Function } from '@stitches/react/types/util';
import { useCallback, useEffect, useState } from 'react';

enum TimerStatus {
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}

const ONE_SECOND = 1000;

// type Props = {
//   boardId: string;
//   socketId?: string;
// };

// const Timer: React.FC<Props> = ({ boardId, socketId }) => {
const Timer: React.FC = () => {
  const [minutesLeft, setMinutesLeft] = useState<number>(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.STOPPED);
  const [clockVisibility, setClockVisibility] = useState<'show' | 'hidden'>('show');

  const timeToString = (time: number) => (time < 10 ? '0' : '') + time;
  const isRunning = useCallback(() => timerStatus === TimerStatus.RUNNING, [timerStatus]);
  const isStopped = useCallback(() => timerStatus === TimerStatus.STOPPED, [timerStatus]);
  const isPaused = useCallback(() => timerStatus === TimerStatus.PAUSED, [timerStatus]);
  const resetTimer = () => {
    setSecondsLeft(0);
    setMinutesLeft(5);
  };
  const startTimer = useCallback(() => {
    setTimerStatus(TimerStatus.RUNNING);
  }, [setTimerStatus]);

  const pauseTimer = () => setTimerStatus(TimerStatus.PAUSED);
  const stopTimer = useCallback(() => {
    setTimerStatus(TimerStatus.STOPPED);
    resetTimer();
  }, [setTimerStatus]);
  const decreaseOneMinute = () => {
    setMinutesLeft((prevMin) => prevMin - 1);
    setSecondsLeft(59);
  };

  useEffect(() => {
    let interval: any;

    if (isRunning() || isPaused()) {
      interval = setInterval(() => {
        if (isRunning()) {
          if (secondsLeft > 0) {
            setSecondsLeft((prevSec) => prevSec - 1);
          } else if (minutesLeft > 0) {
            decreaseOneMinute();
          } else {
            stopTimer();
          }
        } else if (isPaused()) {
          setClockVisibility((prev) => (prev === 'show' ? 'hidden' : 'show'));
        }
      }, ONE_SECOND);
    } else if (isStopped() && interval) {
      clearInterval(interval);
    }

    if (!isPaused()) {
      setClockVisibility('show');
    }

    return () => clearInterval(interval);
  }, [
    secondsLeft,
    minutesLeft,
    timerStatus,
    isRunning,
    isPaused,
    isStopped,
    setClockVisibility,
    setSecondsLeft,
    stopTimer,
  ]);

  const decrementOneMinute = useCallback(() => {
    if (minutesLeft > 0) {
      setMinutesLeft((prevMin) => prevMin - 1);
    }
  }, [minutesLeft]);
  const incrementOneMinute = useCallback(() => {
    if (minutesLeft < 59) {
      setMinutesLeft((prevMin) => prevMin + 1);
    }
  }, [minutesLeft]);
  const incrementFiveSeconds = useCallback(() => {
    if (secondsLeft < 55) {
      setSecondsLeft((prevSec) => prevSec + 5);
    } else if (minutesLeft < 59) {
      incrementOneMinute();
      setSecondsLeft(0);
    }
  }, [secondsLeft, minutesLeft, incrementOneMinute]);
  const decrementFiveSeconds = useCallback(() => {
    if (secondsLeft >= 5) {
      setSecondsLeft((prevSec) => prevSec - 5);
    } else if (minutesLeft > 0) {
      decreaseOneMinute();
      setSecondsLeft(55);
    }
  }, [secondsLeft, minutesLeft]);

  const buildTimeButton = (action: string, onClick: Function) => (
    <Button
      disabled={!isStopped()}
      type="button"
      variant="transparentHover"
      onClick={onClick}
      size="xs"
    >
      <TimeButtonText>{action}</TimeButtonText>
    </Button>
  );
  const buildIncrementButton = (onClick: Function) => buildTimeButton('<', onClick);
  const buildDecrementButton = (onClick: Function) => buildTimeButton('>', onClick);

  const buildPanel = (timeLeft: number, incrementFn: Function, decrementFn: Function) => (
    <TimePanel>
      {buildIncrementButton(incrementFn)}
      <TextControlButtonContainer>{timeToString(timeLeft)}</TextControlButtonContainer>
      {buildDecrementButton(decrementFn)}
    </TimePanel>
  );
  const buildMinutesPanel = () => buildPanel(minutesLeft, incrementOneMinute, decrementOneMinute);
  const buildSecondsPanel = () =>
    buildPanel(secondsLeft, incrementFiveSeconds, decrementFiveSeconds);

  const buildButtonIcon = (action: string, onClick: Function) => (
    <Button onClick={onClick} size="xs" variant="transparent">
      <Icon name={`timer-${action}`} size={28} />
    </Button>
  );

  return (
    <TimerContainer>
      <ClockPanel variant={clockVisibility}>
        {buildMinutesPanel()}:{buildSecondsPanel()}
      </ClockPanel>
      <ControlPanel>
        {buildButtonIcon('stop', stopTimer)}
        {isRunning() ? buildButtonIcon('pause', pauseTimer) : buildButtonIcon('start', startTimer)}
      </ControlPanel>
      <Line />
    </TimerContainer>
  );
};

export default Timer;
