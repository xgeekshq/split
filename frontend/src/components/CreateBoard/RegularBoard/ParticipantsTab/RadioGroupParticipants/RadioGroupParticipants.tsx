import { useSetRecoilState } from 'recoil';

import {
  Label,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/Primitives/Inputs/RadioGroup/RadioGroup';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { styled } from '@/styles/stitches/stitches.config';

type RadioGroupParticipantsProps = {
  optionSelected: string;
  handleSelection: (value: string) => void;
};

const RadioGroupWrapper = styled('div', {
  width: '100%',
  '@media (min-width: 1600px)': { width: '70%' },
});

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
    <RadioGroupWrapper>
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
    </RadioGroupWrapper>
  );
};

export default RadioGroupParticipants;
