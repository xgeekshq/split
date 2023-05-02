import { useState } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { TIME_RANGE } from '@/constants/schedulingOptions/hours';
import { TimeSlot } from '@/types/board/board';
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
    TIME_RANGE.map((time) => {
      if (Number(time.value) > Number(startTime)) customRange.push(time);
    });
  }

  return (
    <>
      <Text fontWeight="medium">Date and time</Text>
      <DatePicker currentDate={currentDate} setDate={setDate} />
      <Flex css={{ flex: 1, pb: '$24' }} direction="row">
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
          <SelectContent options={TIME_RANGE} />
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
          <SelectContent options={isEmpty(customRange) ? TIME_RANGE : customRange} />
        </Select>
      </Flex>
    </>
  );
};

export default DateAndTimePicker;
