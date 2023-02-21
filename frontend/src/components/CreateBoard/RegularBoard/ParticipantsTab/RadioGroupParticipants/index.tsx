import Flex from '@/components/Primitives/Flex';
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroup,
  Label,
} from '@/components/Primitives/RadioGroup';
import Text from '@/components/Primitives/Text';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { useSetRecoilState } from 'recoil';
import { FormStyled } from './styles';

type RadioGroupParticipantsProps = {
  optionSelected: string;
  handleSelection: (value: string) => void;
};

const RadioGroupParticipants = ({
  optionSelected,
  handleSelection,
}: RadioGroupParticipantsProps) => {
  const setSelectedTeam = useSetRecoilState(createBoardTeam);

  const handleSelect = (value: string) => {
    handleSelection(value);
    setSelectedTeam(undefined);
  };

  return (
    <Flex css={{ width: '100%' }}>
      <FormStyled>
        <RadioGroup
          direction="row"
          defaultValue="team"
          aria-label="View density"
          onValueChange={handleSelect}
          value={optionSelected}
        >
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
        </RadioGroup>
      </FormStyled>
    </Flex>
  );
};

export default RadioGroupParticipants;
