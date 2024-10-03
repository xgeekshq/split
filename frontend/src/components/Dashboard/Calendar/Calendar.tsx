/* eslint-disable react/jsx-no-bind */
import { useState } from 'react';
import { CalendarProps } from 'react-calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';

import StyledCalendar from '@/components/Dashboard/Calendar/StyledCalendar';
import NoMeetingsImage from '@/components/images/NoMeetings';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

const StyledContainer = styled(Flex, {
  height: '100%',
  maxWidth: '364px',
  backgroundColor: '$white',
  px: '$32',
  pt: '$76',
});

const StyledNoMeetings = styled(NoMeetingsImage, { mx: '78px' });

const CalendarBar = () => {
  const [currentValue, setOnChange] = useState<Date | null>(new Date());
  const hasMeetings = true;
  const handleOnChange = (date: Value) => {
    if (!date) return;
    if ((date as Date).getTime() !== currentValue?.getTime()) {
      setOnChange(date as Date);
      return;
    }
    setOnChange(null);
  };

  function tileContent(props: CalendarProps) {
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
    <StyledContainer direction="column">
      <Text css={{ mb: '$40' }} heading="4">
        Upcoming
      </Text>
      {!hasMeetings && (
        <Flex
          align="center"
          css={{ mt: '$40', textAlign: 'center' }}
          direction="column"
          gap="24"
          justify="center"
        >
          <StyledNoMeetings />
          <Text color="primary400" css={{ mx: '$41' }} size="md">
            Your have no upcoming <br /> retrospectives any time soon.
          </Text>
        </Flex>
      )}
      {hasMeetings && (
        <StyledCalendar
          minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          minDetail="year"
          nextLabel={<Icon name="arrow-right" />}
          onChange={handleOnChange}
          prevLabel={<Icon name="arrow-left" />}
          tileContent={tileContent}
          value={currentValue}
          formatShortWeekday={(locale, date) =>
            ['Su', 'Mo', 'Th', 'We', 'Th', 'Fr', 'Sa'][(date as Date).getDay()]
          }
        />
      )}
    </StyledContainer>
  );
};
export default CalendarBar;
