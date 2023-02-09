import {
  ClockPanel,
  ControlPanel,
  TimeButtonTitle,
  TimePanel,
  TimePanelText,
  TimerContainer,
} from '@/components/Board/Timer/styles';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
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
    progressWidth,
  } = useTimer({ boardId, isAdmin, emitEvent, listenEvent });

  const buildTimeButton = (action: string, onClick: any) => (
    <Button
      disabled={!isAdmin || isRunning() || isPaused()}
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
  const buildMinutesPanel = () => buildTimePanel(minutes, incrementOneMinute, decrementOneMinute);
  const buildSecondsPanel = () =>
    buildTimePanel(seconds, incrementFiveSeconds, decrementFiveSeconds);

  const buildControlButton = (action: string, onClick: any) => (
    <Button onClick={onClick} size="xs" variant="transparent" disabled={!isAdmin}>
      <Icon name={`timer-${action}`} size={28} />
    </Button>
  );
  const buildStartButton = () => buildControlButton('start', startTimer);
  const buildPauseButton = () => buildControlButton('pause', pauseTimer);
  const buildStopButton = () => buildControlButton('stop', stopTimer);

  return (
    <TimerContainer variant={timerVariant} css={{ $$w: `${progressWidth}` }}>
      <ClockPanel variant={timerVariant}>
        {buildMinutesPanel()}:{buildSecondsPanel()}
      </ClockPanel>
      <ControlPanel>
        {buildStopButton()}
        {isRunning() ? buildPauseButton() : buildStartButton()}
      </ControlPanel>
    </TimerContainer>
  );
};

export default Timer;
