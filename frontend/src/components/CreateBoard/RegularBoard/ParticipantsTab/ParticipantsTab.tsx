import { Dispatch, SetStateAction } from 'react';

import SelectTeam from '@/components/CreateBoard/RegularBoard/ParticipantsTab/SelectTeam/SelectTeam';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import BoardParticipantsList from '@/components/CreateBoard/RegularBoard/ParticipantsTab/BoardParticipantsList/BoardParticipantsList';
import RadioGroupParticipants from '@/components/CreateBoard/RegularBoard/ParticipantsTab/RadioGroupParticipants/RadioGroupParticipants';

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
        optionSelected={optionSelected}
        handleSelection={handleChangeOption}
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
