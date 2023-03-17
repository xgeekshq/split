import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { Dispatch, SetStateAction } from 'react';
import SelectTeam from '@/components/CreateBoard/RegularBoard/SelectTeam';
import SelectParticipants from './SelectParticipants';
import RadioGroupParticipants from './RadioGroupParticipants';

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
