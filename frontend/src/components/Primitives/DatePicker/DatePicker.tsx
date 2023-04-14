import { styled } from '@/styles/stitches/stitches.config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Calendar from '@/components/Primitives/Calendar/Calendar';
import UncontrolledInput from '../Inputs/UncontrolledInput/UncontrolledInput';

// TODO: Styled dropdown trigger
const StyledDropDownTrigger = styled(DropdownMenu.Trigger, {
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
});

export type DatePickerProps = {
  currentDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  setDate: (date: Date) => void;
};

const DatePicker = ({ currentDate, minDate, maxDate, setDate }: DatePickerProps) => (
  <DropdownMenu.Root>
    <StyledDropDownTrigger>
      <UncontrolledInput
        placeholder="Select date"
        IconPositionRight
        cursorType="pointer"
        iconName="calendar-alt"
        currentValue={currentDate?.toLocaleDateString() || ''}
      />
    </StyledDropDownTrigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content align="start">
        <Calendar currentDate={currentDate} setDate={setDate} minDate={minDate} maxDate={maxDate} />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
export default DatePicker;
