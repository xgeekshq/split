import { useState } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import DatePicker from '@components/Primitives/DatePicker/DatePicker';
import Icon from '@components/Primitives/Icons/Icon/Icon';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from '@components/Primitives/Inputs/Select/Select';
import isEmpty from '@utils/isEmpty';

export type SchedulingProps = {
  currentDate?: Date;
  setDate: (date: Date) => void;
};
interface TimeSlot {
  label: string;
  value: string;
}

const TimeRange: TimeSlot[] = [
  {
    label: '01:00 AM',
    value: '0100',
  },
  {
    label: '01:30 AM',
    value: '0130',
  },
  {
    label: '02:00 AM',
    value: '0200',
  },
  {
    label: '02:30 AM',
    value: '0230',
  },
  {
    label: '03:00 AM',
    value: '0300',
  },
  {
    label: '03:30 AM',
    value: '0330',
  },
  {
    label: '04:00 AM',
    value: '0400',
  },
  {
    label: '04:30 AM',
    value: '0430',
  },
  {
    label: '05:00 AM',
    value: '0500',
  },
  {
    label: '05:30 AM',
    value: '0530',
  },
  {
    label: '06:00 AM',
    value: '0600',
  },
  {
    label: '06:30 AM',
    value: '0630',
  },
  {
    label: '07:00 AM',
    value: '0700',
  },
  {
    label: '07:30 AM',
    value: '0730',
  },
  {
    label: '08:00 AM',
    value: '0800',
  },
  {
    label: '08:30 AM',
    value: '0830',
  },
  {
    label: '09:00 AM',
    value: '0900',
  },
  {
    label: '09:30 AM',
    value: '0930',
  },
  {
    label: '10:00 AM',
    value: '1000',
  },
  {
    label: '10:30 AM',
    value: '1030',
  },
  {
    label: '11:00 AM',
    value: '1100',
  },
  {
    label: '11:30 AM',
    value: '1130',
  },
  {
    label: '12:00 AM',
    value: '1200',
  },
  {
    label: '12:30 AM',
    value: '1230',
  },

  {
    label: '01:00 PM',
    value: '1300',
  },
  {
    label: '01:30 PM',
    value: '1330',
  },
  {
    label: '02:00 PM',
    value: '1400',
  },
  {
    label: '02:30 PM',
    value: '1430',
  },
  {
    label: '03:00 PM',
    value: '1500',
  },
  {
    label: '03:30 PM',
    value: '1530',
  },
  {
    label: '04:00 PM',
    value: '1600',
  },
  {
    label: '04:30 PM',
    value: '1630',
  },
  {
    label: '05:00 PM',
    value: '1700',
  },
  {
    label: '05:30 PM',
    value: '1730',
  },
  {
    label: '06:00 PM',
    value: '1800',
  },
  {
    label: '06:30 PM',
    value: '1830',
  },
  {
    label: '07:00 PM',
    value: '1900',
  },
  {
    label: '07:30 PM',
    value: '1930',
  },
  {
    label: '08:00 PM',
    value: '2000',
  },
  {
    label: '08:30 PM',
    value: '2030',
  },
  {
    label: '09:00 PM',
    value: '2100',
  },
  {
    label: '09:30 PM',
    value: '2130',
  },
  {
    label: '10:00 PM',
    value: '2200',
  },
  {
    label: '10:30 PM',
    value: '2230',
  },
  {
    label: '11:00 PM',
    value: '2300',
  },
  {
    label: '11:30 PM',
    value: '2330',
  },
  {
    label: '12:00 PM',
    value: '2400',
  },
  {
    label: '12:30 PM',
    value: '2430',
  },
];

let customRange: TimeSlot[] = [];

const DateAndTimePicker = ({ currentDate, setDate }: SchedulingProps) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  function handleStartTimeChange(event: string) {
    setStartTime(event);
    customRange = [];
    handleCustomRange(event);
  }

  function handleEndTimeChange(event: string) {
    setEndTime(event);
  }

  function handleCustomRange(startTime: string) {
    TimeRange.map((time) => {
      if (Number(time.value) > Number(startTime)) customRange.push(time);
    });
  }

  return (
    <>
      <Text fontWeight="medium">Date and time</Text>
      <DatePicker currentDate={currentDate} setDate={setDate} />
      <Flex css={{ flex: 1, paddingBottom: '24px' }} direction="row">
        <Select
          css={{ width: '50%', height: '$60', marginRight: '$16' }}
          disabled={false}
          onValueChange={handleStartTimeChange}
          value={startTime}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">From</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent options={TimeRange} />
        </Select>
        <Select
          css={{ width: '50%', height: '$60' }}
          disabled={false}
          onValueChange={handleEndTimeChange}
          value={endTime}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">To</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent options={isEmpty(customRange) ? TimeRange : customRange} />
        </Select>
      </Flex>
    </>
  );
};

export { DateAndTimePicker };
