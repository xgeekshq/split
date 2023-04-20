import { Dispatch, SetStateAction, useState } from 'react';

import { UpdateScheduleType } from '@/types/board/board';
import { SelectDateUnit } from '@components/Board/Settings/partials/Scheduling/SelectDateUnit';

export type SchedulingProps = {
  schedulingData: UpdateScheduleType;
  setSchedulingData: Dispatch<SetStateAction<UpdateScheduleType>>;
};

const BoardCreation = ({ schedulingData, setSchedulingData }: SchedulingProps) => {
  const [isBoardCreationActive, setBoardCreation] = useState(false);

  const handleTimeBeforeReunionChange = (timeBefore: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      timeBeforeReunion: timeBefore,
    }));
  };
  const handleCreationTimeUnitChange = (timeUnit: string) => {
    setSchedulingData((prev: UpdateScheduleType) => ({
      ...prev,
      creationTimeUnit: timeUnit,
    }));
  };
  return (
    <SelectDateUnit
      description="Create board days/weeks before retro"
      isChecked={isBoardCreationActive}
      setCheckboxState={setBoardCreation}
      setTimeRange={handleTimeBeforeReunionChange}
      setUnitTime={handleCreationTimeUnitChange}
      timeRange={schedulingData.timeBeforeReunion}
      timeUnit={schedulingData.creationTimeUnit}
      title="Board creation"
    />
  );
};

export { BoardCreation };
