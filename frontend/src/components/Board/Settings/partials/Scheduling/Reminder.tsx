import { Dispatch, SetStateAction, useState } from 'react';

import { UpdateScheduleType } from '@/types/board/board';
import { SelectDateUnit } from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';
import Checkbox from '@components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@components/Primitives/Layout/Flex/Flex';

export type SchedulingProps = {
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};

const ReminderSchedule = ({ schedulingData, setSchedulingData }: SchedulingProps) => {
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
  return (
    <>
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
    </>
  );
};

export { ReminderSchedule };
