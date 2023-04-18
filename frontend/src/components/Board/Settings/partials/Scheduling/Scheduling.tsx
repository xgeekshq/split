import { useState } from 'react';

import {
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionIcon,
  StyledAccordionItem,
  StyledAccordionTrigger,
} from '@/components/Board/Settings/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { DateAndTimePicker } from '@components/Board/Settings/partials/Scheduling/DateAndTime';
import { SelectDateUnit } from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';
import Checkbox from '@components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Separator from '@components/Primitives/Separator/Separator';

export type SchedulingProps = {
  schedulingDate?: Date;
  repeatDate?: Date;
  reminderDate?: Date;
  setRepeatDate: (date: Date) => void;
  setReminderDate: (date: Date) => void;
  setSchedulingDate: (date: Date) => void;
};

const SchedulingSettings = ({
  schedulingDate,
  repeatDate,
  reminderDate,
  setSchedulingDate,
  setReminderDate,
  setRepeatDate,
}: SchedulingProps) => {
  const [isViaSlackActive, setSlackState] = useState<boolean>(false);
  const [isEmailActive, setEmailState] = useState<boolean>(false);
  const [isPrefillingActive, setPrefillingState] = useState<boolean>(false);
  const [isReminderActive, setReminderState] = useState<boolean>(false);
  const [isRepeatActive, setRepeatState] = useState<boolean>(false);

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
            currentDate={schedulingDate}
            setDate={setSchedulingDate}
          ></DateAndTimePicker>
          <Separator></Separator>
          <SelectDateUnit
            currentDate={repeatDate}
            isChecked={isRepeatActive}
            setCheckboxState={setRepeatState}
            setDate={setRepeatDate}
            title="Repeat"
            description="Repeat minutes/days/weeks 
"
          />
          <Separator></Separator>
          <SelectDateUnit
            currentDate={reminderDate}
            description="Send reminder minutes/days/weeks before"
            isChecked={isReminderActive}
            setCheckboxState={setReminderState}
            setDate={setReminderDate}
            title="Reminder"
          />
          <Flex direction="column" style={{ marginLeft: '35px' }}>
            <Checkbox
              checked={isViaSlackActive}
              disabled={!isReminderActive}
              id="repeatCheckbox"
              label="Via Slack"
              size="md"
              handleChange={() => {
                setSlackState(!isViaSlackActive);
              }}
            />
            <Checkbox
              checked={isEmailActive}
              disabled={!isReminderActive}
              id="repeatCheckbox"
              label="Via Email"
              size="md"
              handleChange={() => {
                setEmailState(!isEmailActive);
              }}
            />
            <Checkbox
              checked={isPrefillingActive}
              disabled={!isReminderActive}
              id="repeatCheckbox"
              label="Remind prefilling the cards"
              size="md"
              handleChange={() => {
                setPrefillingState(!isPrefillingActive);
              }}
            />
          </Flex>
        </Flex>
      </StyledAccordionContent>
    </StyledAccordionItem>
  );
};

export { SchedulingSettings };
