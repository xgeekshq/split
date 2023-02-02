import Flex from '@/components/Primitives/Flex';
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
  Label,
} from '@/components/Primitives/RadioGroup';
import Text from '@/components/Primitives/Text';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { useSetRecoilState } from 'recoil';
import { FormStyled } from './styles';

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
    <Flex direction="column" css={{ width: '100%', mt: '$32' }}>
      <FormStyled>
        <RadioGroupRoot defaultValue="team" aria-label="View density" onValueChange={handleSelect}>
          <Flex>
            <RadioGroupItem value="team" id="selectTeam">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <Label htmlFor="selectTeam">
              <Flex direction="column">
                <Text color="primary800" fontWeight="bold" size="sm">
                  Select Team
                </Text>
                <Text size="sm" color="primary500">
                  Select a team for your new board.
                </Text>
              </Flex>
            </Label>
          </Flex>
          <Flex>
            <RadioGroupItem value="participant" id="selectParticipant">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <Label htmlFor="selectParticipant">
              <Flex direction="column">
                <Text color="primary800" fontWeight="bold" size="sm">
                  Select Participants
                </Text>
                <Text size="sm" color="primary500">
                  Select individual participants for your new board.
                </Text>
              </Flex>
            </Label>
          </Flex>
        </RadioGroupRoot>
      </FormStyled>
    </Flex>
  );
};

export default RadioGroupParticipants;
