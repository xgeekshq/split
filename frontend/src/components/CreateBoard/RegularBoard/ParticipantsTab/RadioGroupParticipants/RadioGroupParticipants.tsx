import {
  Label,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/Primitives/Inputs/RadioGroup/RadioGroup';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
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
}: RadioGroupParticipantsProps) => (
  <RadioGroupWrapper>
    <RadioGroup
      aria-label="View density"
      defaultValue="team"
      direction="row"
      onValueChange={handleSelection}
      value={optionSelected}
    >
      <Flex>
        <RadioGroupItem id="selectTeam" value="team">
          <RadioGroupIndicator />
        </RadioGroupItem>
        <Label htmlFor="selectTeam">
          <Flex direction="column">
            <Text color="primary800" fontWeight="bold" size="sm">
              Select Team
            </Text>
            <Text color="primary500" size="sm">
              Select a team for your new board.
            </Text>
          </Flex>
        </Label>
      </Flex>
      <Flex>
        <RadioGroupItem id="selectParticipant" value="participant">
          <RadioGroupIndicator />
        </RadioGroupItem>
        <Label htmlFor="selectParticipant">
          <Flex direction="column">
            <Text color="primary800" fontWeight="bold" size="sm">
              Select Participants
            </Text>
            <Text color="primary500" size="sm">
              Select individual participants for your new board.
            </Text>
          </Flex>
        </Label>
      </Flex>
    </RadioGroup>
  </RadioGroupWrapper>
);
export default RadioGroupParticipants;
