import StyledCalendar from '@/components/Primitives/Calendar/styles';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type CalendarProps = {
  minDate?: Date;
  maxDate?: Date;
  tileContent?: any;
  currentDate?: Date;
  setDate: (date: Date) => void;
};

const Calendar = ({ minDate, maxDate, tileContent, currentDate, setDate }: CalendarProps) => (
  <Flex data-testid="calendar">
    <StyledCalendar
      maxDate={maxDate}
      minDate={minDate}
      minDetail="year"
      nextLabel={<Icon name="arrow-right" />}
      onChange={setDate}
      prevLabel={<Icon name="arrow-left" />}
      tileContent={tileContent}
      value={currentDate}
      formatShortWeekday={(locale: string | undefined, date: Date) =>
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]
      }
    />
  </Flex>
);

export default Calendar;
