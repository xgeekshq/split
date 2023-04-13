import Icon from '@/components/Primitives/Icons/Icon/Icon';
import StyledCalendar from '@/components/Primitives/Calendar/styles';

export type CalendarProps = {
  minDate?: Date;
  maxDate?: Date;
  tileContent?: any;
  currentDate?: Date;
  setDate: (date: Date) => void;
};

const Calendar = ({ minDate, maxDate, tileContent, currentDate, setDate }: CalendarProps) => (
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
);

export default Calendar;
