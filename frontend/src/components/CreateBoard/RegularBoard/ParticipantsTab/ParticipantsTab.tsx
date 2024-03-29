import { Dispatch, SetStateAction } from 'react';

import BoardParticipantsList from '@/components/CreateBoard/RegularBoard/ParticipantsTab/BoardParticipantsList/BoardParticipantsList';
import RadioGroupParticipants from '@/components/CreateBoard/RegularBoard/ParticipantsTab/RadioGroupParticipants/RadioGroupParticipants';
import SelectTeam from '@/components/CreateBoard/RegularBoard/ParticipantsTab/SelectTeam/SelectTeam';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

type Props = {
  optionSelected: string;
  setOptionSelected: Dispatch<SetStateAction<string>>;
  isPageLoading: boolean;
};

const ParticipantsTab = ({ optionSelected, setOptionSelected, isPageLoading }: Props) => {
  const handleChangeOption = (value: string) => {
    setOptionSelected(value);
  };

  return (
    <Flex direction="column" gap={24}>
      <RadioGroupParticipants
        handleSelection={handleChangeOption}
        optionSelected={optionSelected}
      />
      {optionSelected === 'team' ? (
        <SelectTeam />
      ) : (
        <BoardParticipantsList isPageLoading={isPageLoading} />
      )}
    </Flex>
  );
};
export default ParticipantsTab;
