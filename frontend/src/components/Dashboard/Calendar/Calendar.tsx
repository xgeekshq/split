/* eslint-disable react/jsx-no-bind */
import { useState } from 'react';
import { CalendarTileProperties } from 'react-calendar';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
// import NoMeetingsImage from '@/components/images/NoMeetings';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import StyledCalendar from '@/components/Dashboard/Calendar/StyledCalendar';

const StyledContainer = styled(Flex, {
  height: '100%',
  maxWidth: '$364',
  backgroundColor: '$white',
  px: '$40',
  pt: '$24',
  width: '$400',
  position: 'relative',
  borderRadius: '$12',
});

// const StyledNoMeetings = styled(NoMeetingsImage, { mx: '78px' });

const CalendarBar = () => {
  const [currentValue, setOnChange] = useState<Date | null>(new Date());
  //  const hasMeetings = true;
  const handleOnChange = (date: Date) => {
    if (date.getTime() !== currentValue?.getTime()) {
      setOnChange(date);
      return;
    }
    setOnChange(null);
  };

  function tileContent(props: CalendarTileProperties) {
    const { view } = props;
    if (view === 'month') {
      return (
        <Flex css={{ justifyContent: 'center', size: '6', gridRowStart: '3' }}>
          {/* <Dot /> */}
          {/* <TwoDots /> */}
          {/* <ThreeDots /> */}
          {/* <MoreDots /> */}
        </Flex>
      );
    }
    return null;
  }

  return (
    <>
      <input value={currentValue?.toDateString()} />
      <StyledContainer direction="column">
        <StyledCalendar
          minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          minDetail="year"
          nextLabel={<Icon name="arrow-right" />}
          prevLabel={<Icon name="arrow-left" />}
          tileContent={tileContent}
          value={currentValue}
          formatShortWeekday={(locale: string, date: Date) =>
            ['Su', 'Mo', 'Th', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]
          }
          onChange={handleOnChange}
        />
      </StyledContainer>
    </>
  );
};
export default CalendarBar;
