import React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { styled } from '@/styles/stitches/stitches.config';

import Flex from './Flex';
import Text from './Text';
import Icon from './Icon';

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'white',
  cursor: 'pointer',
  boxSizing: 'border-box',
  borderRadius: '$2',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    variant: {
      default: {
        borderColor: '$primaryBase',
        backgroundColor: 'transparent',
        '&[data-state="checked"]': { backgroundColor: '$primaryBase' },
        '&:disabled': {
          borderColor: '$primary100',
          '&[data-state="checked"]': {
            backgroundColor: '$primary100',
          },
        },
      },
      error: {
        borderColor: '$dangerBase',
        '&[data-state="checked"]': {
          backgroundColor: '$dangerBase',
        },
        '&:disabled': {
          borderColor: '$primary100',
          '&[data-state="checked"]': {
            backgroundColor: '$primary100',
          },
        },
      },
    },
    size: {
      sm: {
        width: '$12',
        height: '$12',
        '& svg': {
          width: '$10',
          height: '$10',
        },
      },
      md: {
        width: '$16',
        height: '$16',
        '& svg': {
          width: '$14',
          height: '$14',
        },
      },
    },
  },
  '&[data-state="indeterminate"]': {
    borderColor: '$primaryBase',
    backgroundColor: '$primaryBase',
  },
  defaultVariants: {
    variant: 'default',
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  color: '$white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Checkbox: React.FC<{
  id: string;
  label: string;
  variant?: 'default' | 'error';
  size: 'sm' | 'md';
  checked?: boolean;
  handleChange?: (value: boolean) => void;
  disabled?: boolean;
}> = ({ id, label, variant, size, checked, disabled, handleChange }) => {
  Checkbox.defaultProps = {
    checked: false,
    disabled: false,
    handleChange: undefined,
  };

  return (
    <Flex
      align="center"
      css={{
        height: '$36',
        width: '100%',
        boxSizing: 'border-box',
      }}
      gap={8}
    >
      <StyledCheckbox
        id={id}
        checked={checked}
        onCheckedChange={handleChange}
        disabled={disabled}
        name={id}
        variant={variant}
        size={size}
      >
        <StyledIndicator>
          <Icon name="check" />
        </StyledIndicator>
      </StyledCheckbox>
      <Text
        as="label"
        color={disabled ? 'primary200' : 'primary800'}
        css={{
          cursor: 'pointer',
          wordBreak: 'break-word',
        }}
        htmlFor={id}
        size="sm"
      >
        {label}
      </Text>
    </Flex>
  );
};
export default Checkbox;
