import { Dispatch, SetStateAction, useState } from 'react';

import { UpdateScheduleType } from '@/types/board/board';
import SelectDateUnit from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';
import Checkbox from '@components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@components/Primitives/Layout/Flex/Flex';

export type SchedulingProps = {
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};

const ReminderSchedule = ({ schedulingData, setSchedulingData }: SchedulingProps) => {
  const [isReminderActive, setReminderState] = useState<boolean>(false);

  const handleReminderActiveChange = (isActive: boolean) => {
    setReminderState(isActive);
    if (!isActive) {
      setSchedulingData((prev: UpdateScheduleType) => ({
        ...prev,
        reminderTimeRange: undefined,
        reminderTimeUnit: undefined,
        reminderViaEmail: false,
        reminderPrefillingCards: false,
        reminderViaSlack: false,
      }));
    }
  };

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
      reminderViaSlack: viaSlackActive,
    }));
  };
  const handleEmailChange = (viaEmailActive: boolean) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      reminderViaEmail: viaEmailActive,
    }));
  };

  const handlePrefillingCardChange = (prefillingCards: boolean) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      reminderPrefillingCards: prefillingCards,
    }));
  };
  return (
    <Flex direction="column" gap={16}>
      <SelectDateUnit
        description="Send reminder minutes/days/weeks before"
        isChecked={isReminderActive}
        setCheckboxState={handleReminderActiveChange}
        setTimeRange={handleReminderTimeRangeChange}
        setUnitTime={handleReminderTimeUnitChange}
        timeRange={schedulingData.reminderTimeRange}
        timeUnit={schedulingData.reminderTimeUnit}
        title="Reminder"
      />
      <Flex direction="column" style={{ marginLeft: '35px' }}>
        <Checkbox
          checked={schedulingData.reminderViaSlack}
          disabled={!isReminderActive}
          handleChange={handleSlackChange}
          id="repeatCheckbox"
          label="Via Slack"
          size="md"
        />
        <Checkbox
          checked={schedulingData.reminderViaEmail}
          disabled={!isReminderActive}
          handleChange={handleEmailChange}
          id="repeatCheckbox"
          label="Via Email"
          size="md"
        />
        <Checkbox
          checked={schedulingData.reminderPrefillingCards}
          disabled={!isReminderActive}
          handleChange={handlePrefillingCardChange}
          id="repeatCheckbox"
          label="Remind prefilling the cards"
          size="md"
        />
      </Flex>
    </Flex>
  );
};

export { ReminderSchedule };
