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
};

const SelectDate = ({ placeholder, disabled = false, currentValue }: SearchInputProps) => (
  <Flex
    css={{ position: 'relative', width: '100%', height: 'auto' }}
    direction="column"
    data-testid="selectDate"
  >
    <StyledInputWrapper gap="8" disabled={disabled} style={{ backgroundColor: 'white' }}>
      <Flex css={{ flexGrow: '1', backgroundColor: 'white' }}>
        <StyledInput
          id="selectDate"
          disabled={false}
          placeholder=" "
          value={currentValue}
          css={{ pt: '$28', pb: '$8' }}
          style={{ cursor: 'pointer' }}
        />
        <PlaceholderText as="label" htmlFor="searchInput">
          {placeholder}
        </PlaceholderText>
      </Flex>
      <IconWrapper>
        <Icon
          name="calendar-alt"
          size={24}
          css={{
            color: '$primary300',
            backgroundColor: 'transparent',
          }}
        />
      </IconWrapper>
    </StyledInputWrapper>
  </Flex>
);

export default SelectDate;
