import Flex from '@/components/Primitives/Flex';
import { useState } from 'react';
import SelectTeam from '@/components/CreateBoard/RegularBoard/SelectTeam';
import SelectParticipants from './SelectParticipants';
import RadioGroupParticipants from './RadioGroupParticipants';

const ParticipantsTab = () => {
  const [optionSelected, setOptionSelected] = useState('team');

  const handleChangeOption = (value: string) => {
    setOptionSelected(value);
  };

  return (
    <Flex direction="column" css={{ width: '100%', mb: '$20', height: '$300' }} gap="24">
      <RadioGroupParticipants handleSelection={handleChangeOption} />
      {optionSelected === 'team' ? <SelectTeam /> : <SelectParticipants />}
    </Flex>
  );
};
export default ParticipantsTab;
