import React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'white',
  cursor: 'pointer',
  boxSizing: 'border-box',
  borderRadius: '$3',
  border: '$sizes$1 solid',
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
          borderColor: '$danger500',
          opacity: 0.3,
          '&[data-state="checked"]': {
            backgroundColor: '$danger400',
            opacity: 0.3,
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

export type CheckboxProps = {
  id: string;
  label?: string;
  variant?: 'default' | 'error';
  size: 'sm' | 'md';
  checked?: boolean;
  handleChange?: (value: boolean) => void;
  disabled?: boolean;
};

const Checkbox = ({
  id,
  label,
  variant,
  size,
  checked = false,
  disabled = false,
  handleChange,
}: CheckboxProps) => (
  <Flex align="center" gap={8} data-testid="checkBox">
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
    {label && (
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
    )}
  </Flex>
);
export default Checkbox;
