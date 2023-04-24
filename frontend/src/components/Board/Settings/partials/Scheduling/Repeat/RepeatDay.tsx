import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import Text from '@/components/Primitives/Text/Text';
import { UpdateScheduleType } from '@/types/board/board';
import Icon from '@components/Primitives/Icons/Icon/Icon';
import Checkbox from '@components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from '@components/Primitives/Inputs/Select/Select';
import Flex from '@components/Primitives/Layout/Flex/Flex';

export type RepeatDayProps = {
  disableCheckboxes?: boolean;
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};

const RepeatDay = ({ disableCheckboxes, schedulingData, setSchedulingData }: RepeatDayProps) => {
  const [isDayChecked, setDayChecked] = useState<boolean>(false);
  const [isWeekDayChecked, setWeekDayChecked] = useState<boolean>(false);

  useEffect(() => {
    if (!disableCheckboxes) {
      setDayChecked(false);
      setWeekDayChecked(false);
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        repeatMeetingNWeek: undefined,
        repeatMeetingWeekDay: undefined,
        repeatMeetingDay: undefined,
      }));
    }
  }, [disableCheckboxes]);

  //State handlers
  const handleDayCheckbox = (value: boolean) => {
    if (value === true) {
      setDayChecked(true);
      setWeekDayChecked(false);
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        repeatMeetingNWeek: undefined,
        repeatMeetingWeekDay: undefined,
      }));
    } else {
      setDayChecked(false);
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        repeatMeetingDay: undefined,
      }));
    }
  };

  const handleWeekDayCheckbox = (value: boolean) => {
    if (value === true) {
      setWeekDayChecked(true);
      setDayChecked(false);
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        repeatMeetingDay: undefined,
      }));
    } else {
      setWeekDayChecked(false);
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        repeatMeetingNWeek: undefined,
        repeatMeetingWeekDay: undefined,
      }));
    }
  };

  const handleDayChange = (repeatMeetingDay: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingDay: repeatMeetingDay,
    }));
  };

  const handleWeekChange = (repeatMeetingNWeek: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingNWeek: repeatMeetingNWeek,
    }));
  };

  const handleWeekDayChange = (repeatMeetingWeekDay: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingWeekDay: repeatMeetingWeekDay,
    }));
  };
  const days = [];

  for (let i = 1; i <= 31; i++) {
    const obj = {
      label: i.toString(),
      value: i.toString(),
    };
    days.push(obj);
  }

  return (
    <>
      {/* Repeat on day  */}
      <Flex
        align="center"
        direction="row"
        gap={16}
        style={{
          maxHeight: '100%',
        }}
      >
        <Text>On</Text>
        <Checkbox
          checked={isDayChecked}
          disabled={!disableCheckboxes}
          id="repeatCheckbox"
          showIcon={false}
          size="md"
          variant="round"
          handleChange={() => {
            handleDayCheckbox(!isDayChecked);
          }}
        />

        <Select
          css={{ width: '41.598%', height: '$60' }}
          disabled={!isDayChecked}
          onValueChange={handleDayChange}
          value={schedulingData.repeatMeetingDay}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">Select a day</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent options={days} />
        </Select>
        <Text> day</Text>
      </Flex>
      {/* Repeat on weekDay */}
      <Flex
        align="center"
        direction="row"
        gap={16}
        style={{
          maxHeight: '100%',
        }}
      >
        <Text>On</Text>
        <Checkbox
          checked={isWeekDayChecked}
          disabled={!disableCheckboxes}
          id="repeatCheckbox"
          showIcon={false}
          size="md"
          variant="round"
          handleChange={() => {
            handleWeekDayCheckbox(!isWeekDayChecked);
          }}
        />
        {/* Select week number */}
        <Select
          css={{ width: '50%', height: '$60' }}
          disabled={!isWeekDayChecked}
          onValueChange={handleWeekChange}
          value={schedulingData.repeatMeetingNWeek}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">Select a week</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent
            options={[
              {
                label: 'First',
                value: 'First',
              },
              {
                label: 'Second',
                value: 'Second',
              },
              {
                label: 'Third',
                value: 'Third',
              },
              {
                label: 'Fourth',
                value: 'Fourth',
              },
              {
                label: 'Last',
                value: 'Last',
              },
            ]}
          />
        </Select>
        {/* Select weekDay ex:monday,... */}
        <Select
          css={{ width: '50%', height: '$60' }}
          disabled={!isWeekDayChecked}
          onValueChange={handleWeekDayChange}
          value={schedulingData.repeatMeetingWeekDay}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">Select week day</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent
            options={[
              {
                label: 'Monday',
                value: 'Monday',
              },
              {
                label: 'Tuesday',
                value: 'Tuesday',
              },
              {
                label: 'Wednesday',
                value: 'Wednesday',
              },
              {
                label: 'Thursday',
                value: 'Thursday',
              },
              {
                label: 'Friday',
                value: 'Friday',
              },
              {
                label: 'Saturday',
                value: 'Saturday',
              },
              {
                label: 'Sunday',
                value: 'Sunday',
              },
            ]}
          />
        </Select>
      </Flex>
    </>
  );
};

export { RepeatDay };
