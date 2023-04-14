import Icon from '@/components/Primitives/Icons/Icon/Icon';
import StyledCalendar from '@/components/Primitives/Calendar/styles';
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
      minDate={minDate}
      maxDate={maxDate}
      tileContent={tileContent}
      minDetail="year"
      nextLabel={<Icon name="arrow-right" />}
      prevLabel={<Icon name="arrow-left" />}
      value={currentDate}
      formatShortWeekday={(locale: string | undefined, date: Date) =>
        ['Su', 'Mo', 'Th', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]
      }
      onChange={setDate}
    />
  </Flex>
);

export default Calendar;
