import { Dispatch, SetStateAction, useState } from 'react';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled } from '@stitches/react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Text from '@/components/Primitives/Text/Text';
import { MONTHS } from '@/constants/schedulingOptions/months';
import { UpdateScheduleType } from '@/types/board/board';
import RepeatDay from '@components/Board/Settings/partials/Scheduling/Repeat/RepeatDay';
import SelectDateUnit from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';
import Calendar from '@components/Primitives/Calendar/Calendar';
import Flex from '@components/Primitives/Layout/Flex/Flex';

export type SchedulingProps = {
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};
const StyledDropDownTrigger = styled(DropdownMenu.Trigger, {
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  maxHeight: '$60',
});

const RepeatSchedule = ({ schedulingData, setSchedulingData }: SchedulingProps) => {
  const [isRepeatActive, setRepeatState] = useState<boolean>(false);

  const showRadioGroup =
    schedulingData.firstMeetingDay && schedulingData.repeatMeetingTimeUnit === 'Month';

  const handleRepeatActiveChange = (isActive: boolean) => {
    setRepeatState(isActive);
    if (!isActive) {
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        repeatMeetingTimeRange: undefined,
        repeatMeetingTimeUnit: undefined,
        repeatMeetingUntil: undefined,
      }));
    }
  };

  const handleRepeatTimeUnitChange = (timeUnit: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingTimeUnit: timeUnit,
    }));
  };

  const handleRepeatUnitChange = (date: Value) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingUntil: date as Date,
    }));
  };
  const handleRemoveRepeatUntil = () => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingUntil: undefined,
    }));
  };

  const handleRepeatTimeRangeChange = (timeRange: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatMeetingTimeRange: timeRange,
    }));
  };

  const repeatText =
    'Occurs every ' +
    schedulingData.repeatMeetingTimeRange +
    ' ' +
    (schedulingData.repeatMeetingTimeUnit === 'Day'
      ? ' days'
      : schedulingData.repeatMeetingTimeUnit === 'Week'
        ? ' weeks'
        : ' months') +
    (schedulingData.repeatMeetingDay ? ' on day ' + schedulingData.repeatMeetingDay : '') +
    (schedulingData.repeatMeetingWeekDay && schedulingData.repeatMeetingNWeek
      ? ' on the ' + schedulingData.repeatMeetingNWeek + ' ' + schedulingData.repeatMeetingWeekDay
      : '') +
    ' until:';

  return (
    <>
      <SelectDateUnit
        isChecked={isRepeatActive}
        setCheckboxState={handleRepeatActiveChange}
        setTimeRange={handleRepeatTimeRangeChange}
        setUnitTime={handleRepeatTimeUnitChange}
        timeRange={schedulingData.repeatMeetingTimeRange}
        timeUnit={schedulingData.repeatMeetingTimeUnit}
        title="Repeat"
        description="Repeat minutes/days/weeks 
"
      />

      <RepeatDay
        disableCheckboxes={isRepeatActive}
        schedulingData={schedulingData}
        setSchedulingData={setSchedulingData}
      ></RepeatDay>

      {schedulingData.repeatMeetingTimeRange && schedulingData.repeatMeetingTimeUnit && (
        <Flex align="start" direction="column">
          {showRadioGroup && schedulingData?.firstMeetingDay && <></>}
          <Text color="primary500">{repeatText}</Text>
          {!schedulingData.repeatMeetingUntil && (
            <DropdownMenu.Root>
              <StyledDropDownTrigger disabled={false}>
                <Text link color="infoBase" css={{ width: 'fit-content' }}>
                  Choose an end date
                </Text>
              </StyledDropDownTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="start" style={{ zIndex: '9999' }}>
                  <Calendar
                    currentDate={schedulingData.repeatMeetingUntil}
                    setDate={handleRepeatUnitChange}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
          {schedulingData.repeatMeetingUntil && (
            <Flex gap={20} justify="between">
              <DropdownMenu.Root>
                <StyledDropDownTrigger disabled={false}>
                  <Text link color="primary500" style={{ width: 'fit-content' }}>
                    {MONTHS[schedulingData.repeatMeetingUntil.getMonth()]}{' '}
                    {schedulingData.repeatMeetingUntil.getDate()},{' '}
                    {schedulingData.repeatMeetingUntil.getFullYear()}
                    <Icon
                      css={{ color: '$primary400', paddingBottom: '$2', paddingLeft: '$2' }}
                      name="arrow-down"
                      size={20}
                    />
                  </Text>
                </StyledDropDownTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="start" style={{ zIndex: '9999' }}>
                    <Calendar
                      currentDate={schedulingData.repeatMeetingUntil}
                      setDate={handleRepeatUnitChange}
                    />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              <Text
                link
                color="dangerBase"
                onClick={handleRemoveRepeatUntil}
                style={{ width: 'fit-content' }}
              >
                Remove end date{' '}
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default RepeatSchedule;
