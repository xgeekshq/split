import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import {
  IconWrapper,
  PlaceholderText,
  StyledInput,
  StyledInputWrapper,
} from '@/components/Primitives/Inputs/Input/styles';

export type SearchInputProps = {
  placeholder: string;
  disabled?: boolean;
  currentValue?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
};

const SelectDate = ({
  placeholder,
  disabled = false,
  currentValue,
  handleChange,
  handleClear,
}: SearchInputProps) => (
  <Flex
    css={{ position: 'relative', width: '100%', height: 'auto' }}
    direction="column"
    data-testid="searchInput"
  >
    <StyledInputWrapper gap="8" disabled={disabled} style={{ backgroundColor: 'white' }}>
      <Flex css={{ flexGrow: '1', backgroundColor: 'white' }}>
        <StyledInput
          id="searchInput"
          disabled={false}
          placeholder=" "
          value={currentValue}
          onChange={handleChange}
          css={{ pt: '$28', pb: '$8' }}
          style={{ cursor: 'pointer' }}
        />
        <PlaceholderText as="label" htmlFor="searchInput">
          {placeholder}
        </PlaceholderText>
      </Flex>
      <IconWrapper
        justify="center"
        data-type="clear"
        css={{
          width: '$24',
          height: '$24',
          borderRadius: '100%',
        }}
        onClick={handleClear}
        data-testid="searchInputClear"
      >
        <Icon
          name="calendar-alt"
          size={24}
          css={{
            color: '$grey',
            backgroundColor: 'transparent',
            borderRadius: '100%',
            padding: '$2',
          }}
        />
      </IconWrapper>
    </StyledInputWrapper>
  </Flex>
);

export default SelectDate;
