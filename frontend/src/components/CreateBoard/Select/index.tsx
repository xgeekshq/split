import { OptionType } from '@/components/Boards/MyBoards';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { Team } from '@/types/team/team';
import { components, ControlProps } from 'react-select';
import { selectStyles, StyledBox, StyledSelect } from './styles';

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props}>
    <Flex direction="column" css={{ width: '100%', px: '$17' }}>
      {(props.selectProps.value as { label: string; value: string }).label && (
        <Text color="primary300" size="xs">
          Select Team
        </Text>
      )}

      <Flex css={{ width: '100%' }}>{children}</Flex>
    </Flex>
  </components.Control>
);

type options = {
  label: string;
  value: string;
};

type SelectComponentProps = {
  currentSelectTeamState?: string;
  numberOfTeams: number;
  teamsNames: options[];
  selectedTeam?: Team;
  handleTeamChange: (value: string) => void;
};

const SelectComponent = ({
  currentSelectTeamState,
  numberOfTeams,
  teamsNames,
  selectedTeam,
  handleTeamChange,
}: SelectComponentProps) => (
  <StyledBox
    css={{
      minWidth: 0,
      width: '100%',
      py: '$12',
      height: '$64',
      borderRadius: '$4',
      backgroundColor: 'white',
      border:
        currentSelectTeamState === 'error' ? '1px solid $dangerBase' : '1px solid $primary200',
    }}
    direction="column"
    elevation="1"
  >
    <StyledSelect
      isDisabled={!!(numberOfTeams === 0)}
      components={{
        IndicatorSeparator: () => null,
        Control,
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: '#A9B3BF',
          primary50: 'white',
          primary: 'black',
          text: '#060D16',
        },
      })}
      styles={selectStyles}
      options={teamsNames}
      placeholder={numberOfTeams === 0 ? 'No teams available' : 'Select Team'}
      controlShouldRenderValue={!!selectedTeam}
      defaultValue={{ label: selectedTeam?.name, value: selectedTeam?._id }}
      value={teamsNames.find((option) => option.value === selectedTeam?._id)}
      onChange={(selectedOption) => {
        handleTeamChange((selectedOption as OptionType)?.value);
      }}
    />
  </StyledBox>
);

export default SelectComponent;
