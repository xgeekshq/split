import { styled } from '@stitches/react';

const TimerContainer = styled('div', {
  alignItems: 'center',
  padding: '0',
  backgroundColor: '$white',
  border: '2px solid $primaryBase',
  borderRadius: '$12',
  boxSizing: 'border-box',
  display: 'grid',
  fontFamily: '$digital',
  fontSize: '$38',
  justifyContent: 'center',
  gridTemplateAreas: `
  'clock buttons'
  'line line'
  `,
  height: '64px',
  paddingTop: '$8',
  width: '202px',

  '&::after': {
    content: '""',
    position: 'absolute',
    alignSelf: 'end',
    justifySelf: 'center',
    width: '186px',
    borderBottom: '2px solid $highlight2Base',
  },
});

const ClockPanel = styled('div', {
  display: 'flex',
  gridArea: 'clock',
  marginLeft: '$12',
  marginRight: '$14',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    variant: {
      hidden: {
        opacity: 0.5,
        color: '$highlight2Base',
      },
      show: {
        opacity: 1,
      },
    },
  },
});

const TimePanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const TimeButtonTitle = styled('div', {
  writingMode: 'vertical-rl',
  marginTop: '0',
});

const TimePanelText = styled('div', {
  marginTop: '$4',
  marginBottom: '$1',
});

const ControlPanel = styled('div', {
  display: 'flex',
  gap: '$4',
  gridArea: 'buttons',
  marginRight: '$12',
});

export { TimerContainer, ClockPanel, TimePanel, TimeButtonTitle, TimePanelText, ControlPanel };
