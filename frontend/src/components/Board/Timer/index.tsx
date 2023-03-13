import {
  ClockPanel,
  ControlPanel,
  TimeButtonTitle,
  TimePanel,
  TimePanelText,
  TimerContainer,
} from '@/components/Board/Timer/styles';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import useTimer from '@/hooks/useTimer';
import EmitEvent from '@/types/events/emit-event.type';
import ListenEvent from '@/types/events/listen-event.type';

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
      type="button"
      variant="transparentHover"
      onClick={onClick}
      size="xs"
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
    <Button onClick={onClick} size="xs" variant="transparent" disabled={!isAdmin}>
      <Icon name={`timer-${action}`} size={28} />
    </Button>
  );
  const buildStartButton = () => buildControlButton('start', startTimer);
  const buildPauseButton = () => buildControlButton('pause', pauseTimer);
  const buildStopButton = () => buildControlButton('stop', stopTimer);

  return (
    <TimerContainer variant={timerVariant} css={{ $$w: `${progressBarWidth}` }}>
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
