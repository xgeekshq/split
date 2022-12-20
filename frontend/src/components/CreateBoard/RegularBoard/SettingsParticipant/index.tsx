import Flex from '@/components/Primitives/Flex';
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
} from '@/components/Primitives/RadioGroup';

import Text from '@/components/Primitives/Text';
import { useState } from 'react';
import { FormStyled, LabelStyled } from './styles';

const SettingsParticipant = () => {
  const [option, setOption] = useState('team');

  const handleSelectOption = (value: string) => {
    setOption(value);
  };

  return (
    <Flex direction="column" css={{ width: '100%', mt: '$32' }} gap="24">
      <FormStyled>
        <RadioGroupRoot
          defaultValue={option}
          aria-label="View density"
          onValueChange={handleSelectOption}
        >
          <Flex css={{ alignItems: 'center' }}>
            <RadioGroupItem value="team" id="team">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <Flex direction="column" gap={6}>
              <LabelStyled htmlFor="team">Select Team</LabelStyled>
              <Text size="sm" color="primary500" css={{ pl: '$14' }}>
                Select a team for your new board.
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ alignItems: 'center', mr: '$100' }}>
            <RadioGroupItem value="participant" id="participants">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <Flex direction="column" gap={6}>
              <LabelStyled htmlFor="participants">Select Participants</LabelStyled>
              <Text size="sm" color="primary500" css={{ pl: '$14' }}>
                Select individual participants for your new board.
              </Text>
            </Flex>
          </Flex>
        </RadioGroupRoot>
      </FormStyled>
    </Flex>
  );
};

export default SettingsParticipant;
