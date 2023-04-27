import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import Calendar from '@/components/Primitives/Calendar/Calendar';
import UncontrolledInput from '@/components/Primitives/Inputs/UncontrolledInput/UncontrolledInput';
import { styled } from '@/styles/stitches/stitches.config';

// TODO: Styled dropdown trigger
const StyledDropDownTrigger = styled(DropdownMenu.Trigger, {
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  maxHeight: '$60',
});

export type DatePickerProps = {
  disabled?: boolean;
  currentDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  setDate: (date: Date) => void;
};

const DatePicker = ({ currentDate, disabled, minDate, maxDate, setDate }: DatePickerProps) => (
  <DropdownMenu.Root>
    <StyledDropDownTrigger disabled={disabled}>
      <UncontrolledInput
        IconPositionRight
        currentValue={currentDate?.toLocaleDateString() || ''}
        cursorType="pointer"
        disabled={disabled}
        iconName="calendar-alt"
        placeholder="Select date"
      />
    </StyledDropDownTrigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content align="start" style={{ zIndex: '9999' }}>
        <Calendar currentDate={currentDate} maxDate={maxDate} minDate={minDate} setDate={setDate} />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
export default DatePicker;
