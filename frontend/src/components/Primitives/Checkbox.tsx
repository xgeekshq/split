import React, { Dispatch, useEffect, useState } from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { styled } from '@stitches/react';

import { useFormContext } from 'react-hook-form';
import Flex from './Flex';
import Text from './Text';
import Icon from '../icons/Icon';

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  borderRadius: '$2',
  border: '1px solid $primaryBase',
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
});

export const CheckboxIndicator = StyledIndicator;
const getIndeterminateSize = (boxSize: '12' | '16') => {
  if (boxSize === '12') return '8';
  return '10';
};
const Checkbox: React.FC<{
  label: string;
  id: string;
  variant?: 'default' | 'error';
  checked?: boolean | 'indeterminate';
  disabled?: boolean;
  size: '12' | '16';
  setCheckedTerms?: Dispatch<React.SetStateAction<boolean>> | null;
  handleChange?: ((value: string) => void) | (() => void);
  handleSelectAll?: () => void;
  hasSelectAll?: boolean;
}> = ({
  id,
  label,
  variant,
  size,
  checked,
  disabled,
  handleChange,
  setCheckedTerms,
  handleSelectAll,
  hasSelectAll,
}) => {
  Checkbox.defaultProps = {
    variant: 'default',
    checked: false,
    disabled: false,
    handleChange: undefined,
    setCheckedTerms: null,
    handleSelectAll: undefined,
    hasSelectAll: false,
  };
  const formContext = useFormContext();

  const [currentCheckValue, setCurrentCheckValue] = useState<boolean | undefined | 'indeterminate'>(
    checked,
  );

  useEffect(() => {
    if (formContext) {
      setCurrentCheckValue(formContext.getValues(id));
    }
  }, [formContext, id]);

  const handleCheckedChange = (isChecked: boolean | 'indeterminate') => {
    if (handleChange) handleChange(id);
    if (handleSelectAll) handleSelectAll();
    setCurrentCheckValue(isChecked);
    if (setCheckedTerms != null) setCheckedTerms(!!isChecked);
    if (formContext) {
      formContext.setValue(id, !!isChecked);
    }
  };
  const checkValue = hasSelectAll ? checked : currentCheckValue;

  return (
    <Flex
      css={{
        alignItems: 'center',
        height: '$36',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Flex>
        <StyledCheckbox
          checked={checkValue}
          disabled={disabled}
          id={id}
          name={id}
          variant={variant ?? 'default'}
          css={{
            width: `$${size} !important`,
            height: `$${size} !important`,
            cursor: 'pointer',
          }}
          onCheckedChange={handleCheckedChange}
        >
          <CheckboxIndicator
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                width:
                  currentCheckValue === 'indeterminate'
                    ? `$${getIndeterminateSize(size)} !important`
                    : `$${size} !important`,
                height: `$${size} !important`,
              },
            }}
          >
            {checkValue === true && <Icon name="check" />}
            {checkValue === 'indeterminate' && <Icon name="indeterminate" />}
          </CheckboxIndicator>
        </StyledCheckbox>
      </Flex>
      <Text
        as="label"
        css={{
          paddingLeft: '$8',
          width: '100%',
          cursor: 'pointer',
          color: disabled ? '$primary200' : '$primaryBase',
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
