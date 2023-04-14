import {
  ClockPanel,
  ControlPanel,
  TimeButtonTitle,
  TimePanel,
  TimePanelText,
  TimerContainer,
} from '@/components/Board/Timer/styles';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import useTimer from '@/hooks/useTimer';
import { EmitEvent } from '@/types/events/emit-event.type';
import { ListenEvent } from '@/types/events/listen-event.type';

type TimerProps = {
  boardId: string;
  isAdmin: boolean;
  emitEvent: EmitEvent;
  listenEvent: ListenEvent;
};

const Timer: React.FC<TimerProps> = ({ boardId, isAdmin, emitEvent, listenEvent }) => {
  const {
    minutes,
    seconds,

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
    progressBarWidth,
  } = useTimer({ boardId, isAdmin, emitEvent, listenEvent });

  const buildTimeButton = (action: string, onClick: any) => (
    <Button
      disabled={!isAdmin || isTimerRunning() || isTimerPaused()}
      onClick={onClick}
      size="xxs"
      type="button"
      variant="transparentHover"
    >
      <TimeButtonTitle>{action}</TimeButtonTitle>
    </Button>
  );
  const buildIncrementTimeButton = (onClick: any) => buildTimeButton('<', onClick);
  const buildDecrementTimeButton = (onClick: any) => buildTimeButton('>', onClick);
  const buildTimePanel = (time: string, incrementFn: any, decrementFn: any) => (
    <TimePanel>
      {buildIncrementTimeButton(incrementFn)}
      <TimePanelText>{time}</TimePanelText>
      {buildDecrementTimeButton(decrementFn)}
    </TimePanel>
  );
  const buildMinutesPanel = () =>
    buildTimePanel(minutes, incrementDurationMinutes, decrementDurationMinutes);
  const buildSecondsPanel = () =>
    buildTimePanel(seconds, incrementDurationSeconds, decrementDurationSeconds);

  const buildControlButton = (action: string, onClick: any) => (
    <Button
      css={{ px: '$1', py: '$1' }}
      disabled={!isAdmin}
      onClick={onClick}
      size="xs"
      variant="transparent"
    >
      <Icon css={{ height: '$28 !important', width: '$28 !important' }} name={`timer-${action}`} />
    </Button>
  );
  const buildStartButton = () => buildControlButton('start', startTimer);
  const buildPauseButton = () => buildControlButton('pause', pauseTimer);
  const buildStopButton = () => buildControlButton('stop', stopTimer);

  return (
    <TimerContainer css={{ $$w: `${progressBarWidth}` }} variant={timerVariant}>
      <ClockPanel variant={timerVariant}>
        {buildMinutesPanel()}:{buildSecondsPanel()}
      </ClockPanel>
      <ControlPanel>
        {buildStopButton()}
        {isTimerRunning() ? buildPauseButton() : buildStartButton()}
      </ControlPanel>
    </TimerContainer>
  );
};

export default Timer;
