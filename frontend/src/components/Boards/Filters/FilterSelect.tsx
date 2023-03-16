import Select, { ControlProps, components } from 'react-select';

import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import { filterByTeamSelectStyles } from './styles';

const StyledSelect = styled(Select, {});
interface OptionType {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: OptionType[];
}

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props}>
    <Flex css={{ width: '100%', px: '$17' }}>
      {(props.selectProps.value as { label: string; value: string }).label ? (
        <Flex align="center" css={{ width: '100%' }}>
          <Text
            size="sm"
            color={props.isFocused ? 'primary800' : 'primary300'}
            css={{ paddingBottom: '2.5px' }}
          >
            Team:
          </Text>
          {children}
        </Flex>
      ) : (
        <Flex css={{ width: '100%' }}>{children}</Flex>
      )}
    </Flex>
  </components.Control>
);

const FilterSelect: React.FC<FilterSelectProps> = ({ options }) => {
  const [filterState, setFilterState] = useRecoilState(filterTeamBoardsState);
  const isSelected = !(filterState === 'all' || filterState === 'personal');
  return (
    <StyledSelect
      placeholder="select team"
      className="react-select-container"
      classNamePrefix="react-select"
      components={{
        IndicatorSeparator: () => null,
        Control,
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary50: '#2F3742',
          primary: '#2F3742',
        },
      })}
      styles={filterByTeamSelectStyles}
      controlShouldRenderValue={isSelected}
      options={options}
      value={
        !isSelected
          ? { label: 'select team', value: '' }
          : options.find((option) => option.value === filterState)
      }
      onChange={(selectedOption) => {
        setFilterState((selectedOption as OptionType)?.value);
      }}
    />
  );
};

export default FilterSelect;
