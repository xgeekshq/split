import { Dispatch, SetStateAction, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled } from '@stitches/react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Text from '@/components/Primitives/Text/Text';
import { UpdateScheduleType } from '@/types/board/board';
import { SelectDateUnit } from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';
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

  //State handlers
  const handleRepeatTimeUnitChange = (timeUnit: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatTimeUnit: timeUnit,
    }));
  };

  const handleRepeatUnitChange = (date: Date) => {
    console.log(date);
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatUntil: date,
    }));
  };
  const handleRemoveRepeatUntil = () => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatUntil: undefined,
    }));
  };

  const handleRepeatTimeRangeChange = (timeRange: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      repeatTimeRange: timeRange,
    }));
  };

  return (
    <>
      <SelectDateUnit
        isChecked={isRepeatActive}
        setCheckboxState={setRepeatState}
        setTimeRange={handleRepeatTimeRangeChange}
        setUnitTime={handleRepeatTimeUnitChange}
        timeRange={schedulingData.repeatTimeRange}
        timeUnit={schedulingData.repeatTimeUnit}
        title="Repeat"
        description="Repeat minutes/days/weeks 
"
      />

      {schedulingData.repeatTimeRange && schedulingData.repeatTimeUnit && (
        <Flex align="start" direction="column">
          <Text color="primary500">
            Occurs every {schedulingData.repeatTimeRange}{' '}
            {schedulingData.repeatTimeUnit === 'Day'
              ? 'days'
              : schedulingData.repeatTimeUnit === 'Week'
              ? 'weeks'
              : 'months'}{' '}
            until:
          </Text>
          {!schedulingData.repeatUntil && (
            <DropdownMenu.Root>
              <StyledDropDownTrigger disabled={false}>
                <Text link color="infoBase" style={{ width: 'fit-content' }}>
                  Choose an end date
                </Text>
              </StyledDropDownTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="start" style={{ zIndex: '9999' }}>
                  <Calendar
                    currentDate={schedulingData.repeatUntil}
                    setDate={handleRepeatUnitChange}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
          {schedulingData.repeatUntil && (
            <Flex direction="row" gap={20} justify="between">
              <DropdownMenu.Root>
                <StyledDropDownTrigger disabled={false}>
                  <Text link color="primary500" style={{ width: 'fit-content' }}>
                    {
                      [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'June',
                        'July',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                      ][schedulingData.repeatUntil.getMonth()]
                    }{' '}
                    {schedulingData.repeatUntil.getDate()},{' '}
                    {schedulingData.repeatUntil.getFullYear()}
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
                      currentDate={schedulingData.repeatUntil}
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

export { RepeatSchedule };
