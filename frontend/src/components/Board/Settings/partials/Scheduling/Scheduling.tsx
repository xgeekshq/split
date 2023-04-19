import { Dispatch, SetStateAction, useState } from 'react';

import {
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionIcon,
  StyledAccordionItem,
  StyledAccordionTrigger,
} from '@/components/Board/Settings/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { UpdateScheduleType } from '@/types/board/board';
import { DateAndTimePicker } from '@components/Board/Settings/partials/Scheduling/DateAndTime';
import { RepeatSchedule } from '@components/Board/Settings/partials/Scheduling/Repeat';
import { SelectDateUnit } from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';
import Checkbox from '@components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Separator from '@components/Primitives/Separator/Separator';

export type SchedulingProps = {
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};

const SchedulingSettings = ({ schedulingData, setSchedulingData }: SchedulingProps) => {
  const [isReminderActive, setReminderState] = useState<boolean>(false);

  const handleReminderTimeRangeChange = (timeRange: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      reminderTimeRange: timeRange,
    }));
  };

  const handleReminderTimeUnitChange = (timeUnit: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      reminderTimeUnit: timeUnit,
    }));
  };

  const handleSlackChange = (viaSlackActive: boolean) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      viaSlack: viaSlackActive,
    }));
  };
  const handleEmailChange = (viaEmailActive: boolean) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      viaEmail: viaEmailActive,
    }));
  };

  const handlePrefillingCardChange = (prefillingCards: boolean) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      prefillingCards: prefillingCards,
    }));
  };
  const handleScheduleDateChange = (scheduleDate: Date) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      scheduleDate: scheduleDate,
    }));
  };

  return (
    <StyledAccordionItem value="Scheduling" variant="first">
      <StyledAccordionHeader variant="first">
        <StyledAccordionTrigger>
          <Text heading="5">Scheduling</Text>
          <StyledAccordionIcon name="arrow-down" />
        </StyledAccordionTrigger>
      </StyledAccordionHeader>
      <StyledAccordionContent>
        <Flex direction="column" gap={16}>
          <DateAndTimePicker
            currentDate={schedulingData.scheduleDate}
            setDate={handleScheduleDateChange}
          ></DateAndTimePicker>
          <Separator></Separator>
          {/* REPEAT */}
          <RepeatSchedule schedulingData={schedulingData} setSchedulingData={setSchedulingData} />
          <Separator></Separator>
          {/*Reminder */}
          <SelectDateUnit
            description="Send reminder minutes/days/weeks before"
            isChecked={isReminderActive}
            setCheckboxState={setReminderState}
            setTimeRange={handleReminderTimeRangeChange}
            setUnitTime={handleReminderTimeUnitChange}
            timeRange={schedulingData.reminderTimeRange}
            timeUnit={schedulingData.reminderTimeUnit}
            title="Reminder"
          />
          <Flex direction="column" style={{ marginLeft: '35px' }}>
            <Checkbox
              checked={schedulingData.viaSlack}
              disabled={!isReminderActive}
              handleChange={handleSlackChange}
              id="repeatCheckbox"
              label="Via Slack"
              size="md"
            />
            <Checkbox
              checked={schedulingData.viaEmail}
              disabled={!isReminderActive}
              handleChange={handleEmailChange}
              id="repeatCheckbox"
              label="Via Email"
              size="md"
            />
            <Checkbox
              checked={schedulingData.prefillingCards}
              disabled={!isReminderActive}
              handleChange={handlePrefillingCardChange}
              id="repeatCheckbox"
              label="Remind prefilling the cards"
              size="md"
            />
          </Flex>
        </Flex>
      </StyledAccordionContent>
    </StyledAccordionItem>
  );
};

export { SchedulingSettings };
