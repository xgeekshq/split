import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  IconWrapper,
  PlaceholderText,
  StyledInput,
  StyledInputWrapper,
} from '@/components/Primitives/Inputs/Input/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type UncontrolledInputProps = {
  placeholder: string;
  iconName?: string;
  cursorType?: string;
  IconPositionRight?: boolean;
  disabled?: boolean;
  currentValue?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
};

const UncontrolledInput = ({
  placeholder,
  IconPositionRight = false,
  cursorType = 'default',
  iconName,
  disabled = false,
  currentValue,
  handleChange,
  handleClear,
}: UncontrolledInputProps) => (
  <Flex
    css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto' }}
    data-testid="uncontrolledInput"
    direction="column"
  >
    <StyledInputWrapper disabled={disabled} gap="8">
      {iconName && (
        <Flex style={{ order: IconPositionRight ? 2 : 1 }}>
          <IconWrapper>
            <Icon
              name={iconName}
              css={{
                color: '$primary300',
              }}
            />
          </IconWrapper>
        </Flex>
      )}

      <Flex css={{ flexGrow: '1' }} style={{ order: IconPositionRight ? 1 : 2 }}>
        <StyledInput
          css={{ pt: '$28', pb: '$8' }}
          disabled={disabled}
          id="uncontrolledInput"
          onChange={handleChange}
          placeholder=" "
          style={{ cursor: cursorType || '' }}
          value={currentValue}
        />
        <PlaceholderText as="label" color="primary300" htmlFor="uncontrolledInput">
          {placeholder}
        </PlaceholderText>
      </Flex>
      {handleClear && (
        <IconWrapper
          data-testid="uncontrolledInputClear"
          data-type="clear"
          justify="center"
          onClick={handleClear}
          css={{
            width: '$24',
            height: '$24',
            borderRadius: '100%',
            order: 3,
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
      )}
    </StyledInputWrapper>
  </Flex>
);

export default UncontrolledInput;
