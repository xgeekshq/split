import { Dispatch, SetStateAction } from 'react';

import SelectTeam from '@/components/CreateBoard/RegularBoard/ParticipantsTab/SelectTeam/SelectTeam';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import RadioGroupParticipants from '@/components/CreateBoard/RegularBoard/ParticipantsTab/RadioGroupParticipants/RadioGroupParticipants';
import BoardParticipantsList from '@/components/CreateBoard/RegularBoard/ParticipantsTab/BoardParticipantsList/BoardParticipantsList';

type Props = { optionSelected: string; setOptionSelected: Dispatch<SetStateAction<string>> };

const ParticipantsTab = ({ optionSelected, setOptionSelected }: Props) => {
  const handleChangeOption = (value: string) => {
    setOptionSelected(value);
  };

  return (
    <Flex direction="column" gap={24}>
      <RadioGroupParticipants
        optionSelected={optionSelected}
        handleSelection={handleChangeOption}
      />
      {optionSelected === 'team' ? <SelectTeam /> : <BoardParticipantsList />}
    </Flex>
  );
};
export default ParticipantsTab;
