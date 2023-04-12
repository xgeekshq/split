import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Calendar from '@/components/Primitives/Calendar/Calendar';
import SelectDate from '@/components/Primitives/Inputs/SelectDate/SelectDate';

const StyledContainer = styled(Flex, {
  height: '100%',
  maxWidth: '$364',
  backgroundColor: '$white',
  px: '$40',
  pt: '$24',
  width: '$400',
  position: 'relative',
  borderRadius: '$12',
  boxShadow: '$1 $1 $5 #aaaaaa',
  mt: '$5',
});

// TODO: Styled dropdown trigger
const StyledDropDownTrigger = styled(DropdownMenu.Trigger, {
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
});

export type DatePickerProps = {
  currentDate?: Date;
  setDate: (date: Date) => void;
};

const DatePicker = ({ currentDate, setDate }: DatePickerProps) => (
  <DropdownMenu.Root>
    <StyledDropDownTrigger>
      <SelectDate
        placeholder="Select date"
        currentValue={currentDate?.toLocaleDateString() || ''}
        disabled
      />
    </StyledDropDownTrigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content align="start">
        <StyledContainer direction="column" onClick={(event) => event.stopPropagation()}>
          <Calendar currentDate={currentDate} setDate={setDate} />
        </StyledContainer>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
export default DatePicker;
