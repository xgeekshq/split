import { styled } from '@stitches/react';

const TimerContainer = styled('div', {
  alignItems: 'center',
  border: '2px solid $primaryBase',
  borderRadius: '$12',
  boxSizing: 'border-box',
  display: 'grid',
  fontFamily: '$digital',
  fontSize: '$38',
  gridTemplateAreas: `
  'clock buttons'
  'line line'
  `,
  justifyContent: 'center',
  height: '64px',
  paddingTop: '$2',
  width: '202px',
  '&::after': {
    alignSelf: 'end',
    borderBottom: '2px solid $highlight2Base',
    content: '""',
    gridArea: 'line',
    marginBottom: '20px',
    justifySelf: 'start',
    //    position: 'absolute',
    width: '$$w',
  },
  variants: {
    variant: {
      hidden: {
        '&::after': {
          opacity: 0.5,
        },
      },
      show: {
        '&::after': {
          opacity: 1,
        },
      },
    },
  },
});

const ClockPanel = styled('div', {
  marginTop: '$2',
  alignItems: 'center',
  display: 'flex',
  marginLeft: '$10',
  marginRight: '$10',
  gridArea: 'clock',
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

const ControlPanel = styled('div', {
  display: 'flex',
  gap: '$4',
  gridArea: 'buttons',
  marginRight: '$10',
});

const TimePanel = styled('div', {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: '$2',
});

const TimeButtonTitle = styled('div', {
  writingMode: 'vertical-rl',
});

const TimePanelText = styled('div', {
  marginTop: '$6',
  marginBottom: '$2',
});

export { TimerContainer, ClockPanel, TimePanel, TimeButtonTitle, TimePanelText, ControlPanel };
