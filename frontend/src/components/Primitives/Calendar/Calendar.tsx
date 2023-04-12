import { useState } from 'react';
import { styled } from '@/styles/stitches/stitches.config';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import StyledCalendar from '@/components/Primitives/Calendar/StyledCalendar';
import SelectDate from '../Inputs/SelectDate/SelectDate';
import Button from '../Inputs/Button/Button';

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

const CalendarBar = () => {
  const [currentValue, setOnChange] = useState<Date | null>(null);
  const handleOnChange = (date: Date) => {
    if (date.getTime() !== currentValue?.getTime()) {
      setOnChange(date);
      return;
    }

    setOnChange(null);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button style={{ padding: '0', backgroundColor: 'transparent', border: 'none' }}>
          <SelectDate
            placeholder="Select date"
            currentValue={currentValue?.toLocaleDateString() || ''}
            disabled
          />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start">
          <DropdownMenu.Item>
            <StyledContainer direction="column" onClick={(event) => event.stopPropagation()}>
              <StyledCalendar
                minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                minDetail="year"
                nextLabel={<Icon name="arrow-right" />}
                prevLabel={<Icon name="arrow-left" />}
                value={currentValue}
                formatShortWeekday={(locale: string | undefined, date: Date) =>
                  ['Su', 'Mo', 'Th', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]
                }
                onChange={handleOnChange}
              />
            </StyledContainer>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
export default CalendarBar;
