import { Dispatch, SetStateAction } from 'react';
import Select, { ControlProps, components } from 'react-select';

import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { filterByTeamSelectStyles } from './styles';

const StyledSelect = styled(Select, {});
interface OptionType {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: OptionType[];
  setFilter: Dispatch<SetStateAction<string>>;
  filter: string;
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

const FilterSelect: React.FC<FilterSelectProps> = ({ filter, options, setFilter }) => {
  const isSelected = filter !== 'all' && filter !== 'personal';
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
          primary25: '#A9B3BF',
          primary50: 'white',
          primary: '#2F3742',
          text: '#060D16',
        },
      })}
      styles={filterByTeamSelectStyles}
      controlShouldRenderValue={!(filter === 'all' || filter === 'personal')}
      options={options}
      value={
        !isSelected
          ? { label: 'select team', value: '' }
          : options.find((option) => option.value === filter)
      }
      onChange={(selectedOption) => {
        setFilter((selectedOption as OptionType)?.value);
      }}
    />
  );
};

export default FilterSelect;
