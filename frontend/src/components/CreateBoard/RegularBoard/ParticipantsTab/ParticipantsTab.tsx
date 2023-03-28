import { Dispatch, SetStateAction } from 'react';

import SelectTeam from '@/components/CreateBoard/RegularBoard/ParticipantsTab/SelectTeam/SelectTeam';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import RadioGroupParticipants from './RadioGroupParticipants/RadioGroupParticipants';
import SelectParticipants from './SelectParticipants/SelectParticipants';

type Props = { optionSelected: string; setOptionSelected: Dispatch<SetStateAction<string>> };

const ParticipantsTab = ({ optionSelected, setOptionSelected }: Props) => {
  const handleChangeOption = (value: string) => {
    setOptionSelected(value);
  };

  return (
    <Flex direction="column" css={{ width: '100%', mb: '$20', height: '$300' }} gap="24">
      <RadioGroupParticipants
        optionSelected={optionSelected}
        handleSelection={handleChangeOption}
      />
      {optionSelected === 'team' ? <SelectTeam /> : <SelectParticipants />}
    </Flex>
  );
};
export default ParticipantsTab;
