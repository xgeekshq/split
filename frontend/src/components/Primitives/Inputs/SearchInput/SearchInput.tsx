import React from 'react';

import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Flex';
import { IconWrapper, PlaceholderText, StyledInput, StyledInputWrapper } from '../Input/styles';

interface InputProps {
  placeholder: string;
  disabled?: boolean;
  currentValue?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
}

const SearchInput: React.FC<InputProps> = ({
  placeholder,
  disabled = false,
  currentValue,
  handleChange,
  handleClear,
}) => (
  <Flex
    css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto' }}
    direction="column"
    data-testid="searchInput"
  >
    <StyledInputWrapper gap="8" disabled={disabled}>
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
          disabled={disabled}
          placeholder=" "
          value={currentValue}
          onChange={handleChange}
        />
        <PlaceholderText as="label">{placeholder}</PlaceholderText>
      </Flex>
      <IconWrapper
        css={{
          width: '$24',
          height: '$24',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '100%',
        }}
        onClick={handleClear}
      >
        <Icon
          name="close"
          size={16}
          css={{
            color: '$white',
            backgroundColor: '$primary100',
            borderRadius: '100%',
            padding: '2px',
          }}
        />
      </IconWrapper>
    </StyledInputWrapper>
  </Flex>
);

export default SearchInput;
