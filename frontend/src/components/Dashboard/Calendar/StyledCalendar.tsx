import Calendar from 'react-calendar';

import { styled } from '@/styles/stitches/stitches.config';

const StyledCalendar = styled(Calendar, {
  '.react-calendar': {
    maxWidth: '100%',
    backgroundColor: 'white',
    fontFamily: '$body',
    border: 'none',
  },
  '.react-calendar__navigation': {
    display: 'flex',
    height: '56px',
    mb: '$8',
    border: 'none',
  },
  '.react-calendar__navigation__label': {
    position: 'absolute',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:disabled': {
      cursor: 'default',
    },
    top: '158px',
    ml: '$6',
  },
  '.react-calendar__navigation__label__labelText--from': {
    fontWeight: '$bold',
    fontSize: '$20',
    lineHeight: '$24',
    letterSpacing: '$0-25',
    fontFamily: '$body',
  },
  '.react-calendar__navigation__next-button': {
    position: 'absolute',
    '&:hover': {
      cursor: 'pointer',
    },
    top: '158px',
    right: '42px',
  },
  '.react-calendar__navigation__prev-button': {
    position: 'absolute',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:disabled': {
      cursor: 'default',
    },
    top: '158px',
    right: '66.2px',
  },
  '.react-calendar--doubleView .react-calendar__viewContainer': {
    display: 'flex',
    margin: '-0.5em',
  },
  '.react-calendar--doubleView .react-calendar__viewContainer > *': {
    width: '50%',
    margin: '0.5em',
  },
  '.react-calendar  .react-calendar *  .react-calendar *:before  .react-calendar *:after': {
    '-moz-box-sizing': 'border-box',
    '-webkit-box-sizing': 'border-box',
    boxSizing: 'border-box',
  },
  '.react-calendar__navigation__prev2-button': {
    display: 'none',
  },
  '.react-calendar__navigation__next2-button': {
    display: 'none',
  },
  '.react-calendar button': {
    margin: 0,
    border: 0,
    outline: 'none',
  },
  '.react-calendar button:enabled:hover': {
    cursor: 'pointer',
  },

  '.react-calendar__navigation button': {
    border: 'none',
    minWidth: '24px',
    background: '$white',
    '& hover': {
      cursor: 'pointer',
    },
  },
  '.react-calendar__navigation button:disabled': {
    backgroundColor: 'white',
    '& svg': {
      color: '$primary100',
    },
    '& hover': {
      cursor: 'none',
    },
  },

  '.react-calendar__navigation button:enabled:hover .react-calendar__navigation button:enabled:focus':
    {
      border: 'none',
      backgroundColor: '#e6e6e6',
    },
  '.react-calendar__month-view__weekdays': {
    px: '2px',
    textAlign: 'center',
    fontWeight: '$bold',
    fontSize: '$16',
    height: '$36',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    mb: '$4',
  },
  '.react-calendar__month-view__weekdays__weekday': {
    fontFamily: '$body',
    textDecoration: 'none',
    '& abbr': {
      textDecoration: 'none',
      fontSize: '$12',
      textAlign: 'center',
      color: '$primary300',
      fontWeight: '$regular',
    },
  },
  '.react-calendar__month-view__weekNumbers .react-calendar__tile': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '$body',
  },
  '.react-calendar__year-view__months__month': {
    fontFamily: '$body',
  },
  '.react-calendar__month-view__days__day--weekend': {},
  '.react-calendar__month-view__days__day--neighboringMonth': {
    visibility: 'hidden',
  },
  '.react-calendar__tile': {
    reset: 'all',
    maxWidth: '100%',
    display: 'grid',
    gridTemplateRows: '1fr 1fr 1fr',
    size: '42px',
    background: 'none',
    textAlign: 'center',
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    boxShadow: 'none',
    boxSize: 'border-box',
    borderRadius: '100%',
    fontSize: '$16',
    fontWeight: '$medium',
    lineHeight: '$20',
    my: '$4',

    '& abbr': {
      gridRowStart: '2',
    },
    '@hover': {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  '.react-calendar__tile:disabled': {
    backgroundColor: '$white',
  },
  '.react-calendar__tile:enabled:hover .react-calendar__tile:enabled:focus': {
    backgroundColor: '$highlight2dark',
  },
  '.react-calendar__tile--now': {
    backgroundColor: 'transparent',
    border: '1px solid $colors$highlight2Lighter',
  },
  '.react-calendar__tile--now:enabled:hover .react-calendar__tile--now:enabled:focus': {
    backgroundColor: '#ffffa9',
  },
  '.react-calendar__tile--hasActive': {
    backgroundColor: '$highlight2dark',
  },
  '.react-calendar__tile--hasActive:enabled:hover .react-calendar__tile--hasActive:enabled:focus': {
    backgroundColor: '#a9d4ff',
  },
  '.react-calendar__tile--active': {
    backgroundColor: '$highlight2Dark',
    '& svg': {
      display: 'none',
    },
    color: 'white',
    border: 'none',
  },
  '.react-calendar__tile--active:enabled:hover .react-calendar__tile--active:enabled:focus': {
    backgroundColor: '#1087ff',
  },
  '.react-calendar--selectRange .react-calendar__tile--hover': {
    backgroundColor: '#e6e6e6',
  },
});

export default StyledCalendar;
