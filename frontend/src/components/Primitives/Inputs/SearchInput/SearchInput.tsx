import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  IconWrapper,
  PlaceholderText,
  StyledInput,
  StyledInputWrapper,
} from '@/components/Primitives/Inputs/Input/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type SearchInputProps = {
  placeholder: string;
  disabled?: boolean;
  currentValue?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
};

const SearchInput = ({
  placeholder,
  disabled = false,
  currentValue,
  handleChange,
  handleClear,
}: SearchInputProps) => (
  <Flex
    css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto' }}
    data-testid="searchInput"
    direction="column"
  >
    <StyledInputWrapper disabled={disabled} gap="8">
      <IconWrapper>
        <Icon
          name="search"
          css={{
            color: '$primary300',
          }}
        />
      </IconWrapper>
      <Flex css={{ flexGrow: '1' }}>
        <StyledInput
          css={{ pt: '$28', pb: '$8' }}
          disabled={disabled}
          id="searchInput"
          onChange={handleChange}
          placeholder=" "
          value={currentValue}
        />
        <PlaceholderText as="label" htmlFor="searchInput">
          {placeholder}
        </PlaceholderText>
      </Flex>
      <IconWrapper
        data-testid="searchInputClear"
        data-type="clear"
        justify="center"
        onClick={handleClear}
        css={{
          width: '$24',
          height: '$24',
          borderRadius: '100%',
        }}
      >
        <Icon
          name="close"
          size={16}
          css={{
            color: '$white',
            backgroundColor: '$primary100',
            borderRadius: '100%',
            padding: '$2',
          }}
        />
      </IconWrapper>
    </StyledInputWrapper>
  </Flex>
);

export default SearchInput;
