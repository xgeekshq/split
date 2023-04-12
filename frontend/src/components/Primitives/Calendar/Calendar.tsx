import Icon from '@/components/Primitives/Icons/Icon/Icon';
import StyledCalendar from '@/components/Primitives/Calendar/StyledCalendar';

export type CalendarProps = {
  currentDate?: Date;
  setDate: (date: Date) => void;
};

const Calendar = ({ currentDate, setDate }: CalendarProps) => (
  <StyledCalendar
    minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
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
