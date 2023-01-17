import Flex from '@/components/Primitives/Flex';
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
} from '@/components/Primitives/RadioGroup';
import Text from '@/components/Primitives/Text';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { useSetRecoilState } from 'recoil';
import { FormStyled, LabelStyled } from './styles';

type RadioGroupParticipantsProps = {
  handleSelection: (value: string) => void;
};

const RadioGroupParticipants = ({ handleSelection }: RadioGroupParticipantsProps) => {
  const setSelectedTeam = useSetRecoilState(createBoardTeam);

  const handleSelect = (value: string) => {
    handleSelection(value);
    setSelectedTeam(undefined);
  };

  return (
    <Flex direction="column" css={{ width: '100%', mt: '$32' }} gap="24">
      <FormStyled>
        <RadioGroupRoot defaultValue="team" aria-label="View density" onValueChange={handleSelect}>
          <Flex css={{ alignItems: 'center' }}>
            <RadioGroupItem value="team" id="selectTeam">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <Flex direction="column" gap={6}>
              <LabelStyled htmlFor="selectTeam" css={{ cursor: 'pointer' }}>
                Select Team
              </LabelStyled>
              <Text size="sm" color="primary500" css={{ pl: '$14' }}>
                Select a team for your new board.
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ alignItems: 'center', mr: '$100' }}>
            <RadioGroupItem value="participant" id="selectParticipant">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <Flex direction="column" gap={6}>
              <LabelStyled htmlFor="selectParticipant" css={{ cursor: 'pointer' }}>
                Select Participants
              </LabelStyled>
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

export default RadioGroupParticipants;
