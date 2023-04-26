import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import Text from '@/components/Primitives/Text/Text';
import { WEEK_DAYS_FULL_NAME } from '@/constants/schedulingOptions/weeks';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const days = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return {
        label: day.toString(),
        value: day.toString(),
      };
    });
  }, []);

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
        {/* TODO: CHANGE */}
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
          <SelectContent options={WEEK_DAYS_FULL_NAME} />
        </Select>
      </Flex>
    </>
  );
};

export default RepeatDay;
