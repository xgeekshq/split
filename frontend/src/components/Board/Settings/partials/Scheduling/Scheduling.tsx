import { Dispatch, SetStateAction } from 'react';

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
import { BoardCreation } from '@components/Board/Settings/partials/Scheduling/Creation/BoardCreation';
import DateAndTimePicker from '@components/Board/Settings/partials/Scheduling/DateAndTime';
import { ReminderSchedule } from '@components/Board/Settings/partials/Scheduling/Reminder/Reminder';
import { RepeatSchedule } from '@components/Board/Settings/partials/Scheduling/Repeat/Repeat';
import Separator from '@components/Primitives/Separator/Separator';

export type SchedulingProps = {
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};

const SchedulingSettings = ({ schedulingData, setSchedulingData }: SchedulingProps) => {
  const handleScheduleDateChange = (scheduleDate: Date) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      firstMeetingDay: scheduleDate,
    }));
  };

  return (
    <StyledAccordionItem value="Scheduling">
      <StyledAccordionHeader>
        <StyledAccordionTrigger>
          <Text heading="5">Scheduling</Text>
          <StyledAccordionIcon name="arrow-down" />
        </StyledAccordionTrigger>
      </StyledAccordionHeader>
      <StyledAccordionContent>
        <Flex direction="column" gap={16}>
          <DateAndTimePicker
            currentDate={schedulingData.firstMeetingDay}
            setDate={handleScheduleDateChange}
          ></DateAndTimePicker>
          <Separator />
          <BoardCreation schedulingData={schedulingData} setSchedulingData={setSchedulingData} />
          <Separator />
          <RepeatSchedule schedulingData={schedulingData} setSchedulingData={setSchedulingData} />
          <Separator />
          <ReminderSchedule schedulingData={schedulingData} setSchedulingData={setSchedulingData} />
        </Flex>
      </StyledAccordionContent>
    </StyledAccordionItem>
  );
};

export default SchedulingSettings;
