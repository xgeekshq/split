import React from 'react';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';

import DialogFooter from '@/components/Primitives/Dialogs/Dialog/DialogFooter';
import DialogHeader from '@/components/Primitives/Dialogs/Dialog/DialogHeader';

import Text from '@/components/Primitives/Text/Text';

import 'react-datepicker/dist/react-datepicker.css';
import Flex from '../Layout/Flex/Flex';
import StyledDatePicker from './StyledDatePicker';

export type CalendarProps = {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
};
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const Calendar = ({ selectedDate, onChangeDate }: CalendarProps) => (
  <StyledDatePicker
    renderCustomHeader={({
      date,

      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    }) => (
      <div
        style={{
          margin: 10,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Text>
          {months[date.getMonth()]} {date.getFullYear()}
        </Text>
        <Flex css={{ 'margin-left': 'auto' }}>
          <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} isIcon>
            <Icon size={60} name="arrow-left" />
          </Button>
          <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} isIcon>
            <Icon size={60} name="arrow-right" />
          </Button>
        </Flex>
      </div>
    )}
    selected={selectedDate}
    onChange={onChangeDate}
  />
);

Calendar.Footer = DialogFooter;
Calendar.Header = DialogHeader;

export default Calendar;
