import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import Calendar from '@/components/Primitives/Calendar/Calendar';
import { styled } from '@/styles/stitches/stitches.config';
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
        IconPositionRight
        currentValue={currentDate?.toLocaleDateString() || ''}
        cursorType="pointer"
        iconName="calendar-alt"
        placeholder="Select date"
      />
    </StyledDropDownTrigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content align="start">
        <Calendar currentDate={currentDate} maxDate={maxDate} minDate={minDate} setDate={setDate} />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
export default DatePicker;
