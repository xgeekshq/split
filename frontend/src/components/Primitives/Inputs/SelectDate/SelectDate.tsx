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
};

const SelectDate = ({ placeholder, disabled = false, currentValue }: SearchInputProps) => (
  <Flex
    css={{ position: 'relative', width: '100%', height: 'auto' }}
    data-testid="selectDate"
    direction="column"
  >
    <StyledInputWrapper disabled={disabled} gap="8" style={{ backgroundColor: 'white' }}>
      <Flex css={{ flexGrow: '1', backgroundColor: 'white' }}>
        <StyledInput
          css={{ pt: '$28', pb: '$8' }}
          disabled={false}
          id="selectDate"
          placeholder=" "
          style={{ cursor: 'pointer' }}
          value={currentValue}
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
