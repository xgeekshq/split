import Select, { components, ControlProps } from 'react-select';
import { useRecoilState } from 'recoil';

import { filterByTeamSelectStyles } from '@/components/Boards/Filters/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import { styled } from '@/styles/stitches/stitches.config';

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
            color={props.isFocused ? 'primary800' : 'primary300'}
            css={{ paddingBottom: '2.5px' }}
            size="sm"
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
      className="react-select-container"
      classNamePrefix="react-select"
      controlShouldRenderValue={isSelected}
      options={options}
      placeholder="select team"
      styles={filterByTeamSelectStyles}
      components={{
        IndicatorSeparator: () => null,
        Control,
      }}
      onChange={(selectedOption) => {
        setFilterState((selectedOption as OptionType)?.value);
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary50: '#2F3742',
          primary: '#2F3742',
        },
      })}
      value={
        !isSelected
          ? { label: 'select team', value: '' }
          : options.find((option) => option.value === filterState)
      }
    />
  );
};

export default FilterSelect;
