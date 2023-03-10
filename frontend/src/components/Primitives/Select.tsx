import { ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { styled, CSS } from '@/styles/stitches/stitches.config';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import Box from './Layout/Box';
import Flex from './Layout/Flex';

export const SelectTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '$4',
  lineHeight: '$24',
  backgroundColor: '$transparent',
  color: '$primary800',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  boxSizing: 'border-box',
  gap: '$8',
  '&[data-placeholder]': {
    fontSize: '$16',
    color: '$primary300',
  },
});

export const SelectIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$primary800',
  display: 'flex',
  alignItems: 'center',
});

const StyledContent = styled(SelectPrimitive.Content, {
  zIndex: 99,
  backgroundColor: 'white',
  boxShadow: '0px 4px 16px rgba(18, 25, 34, 0.05)',
  width: 'var(--radix-select-trigger-width)',
  maxHeight: 'var(--radix-select-content-available-height)',
  borderRadius: '5px',
  overflow: 'auto',
});

export const SelectItem = styled(SelectPrimitive.Item, {
  fontSize: 16,
  lineHeight: 1,
  color: '$primary800',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 35,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',
  '&[data-disabled]': {
    color: 'blue',
    pointerEvents: 'none',
  },
  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: '$primary100',
    cursor: 'pointer',
  },
  '&[data-state="checked"]': {
    backgroundColor: '$primaryBase',
    color: '$white',
    cursor: 'pointer',
  },
});

export const SelectLabel = styled(SelectPrimitive.Label, {
  padding: '0 25px',
  fontSize: 12,
  lineHeight: '25px',
  color: 'blue',
});

export const SelectItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const SelectValue = styled(SelectPrimitive.Value, {
  color: '$primary800',
  fontSize: '16px',
});

type Option = {
  label: string;
  value: string;
};

type ContentProps = { options: Option[] };

export const SelectContent = ({ options }: ContentProps) => (
  <StyledContent position="popper" collisionPadding={100}>
    <ScrollArea.Root type="auto">
      <SelectPrimitive.Viewport>
        <ScrollArea.Viewport>
          {options.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            </SelectItem>
          ))}
        </ScrollArea.Viewport>
      </SelectPrimitive.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  </StyledContent>
);

export type SelectProps = {
  children: ReactNode;
  disabled: boolean;
  hasError?: boolean;
  css?: CSS;
  [x: string]: any;
};

export const Select = ({ children, disabled, hasError = false, css, ...props }: SelectProps) => {
  const StyledBox = styled(Flex, Box, {});

  return (
    <StyledBox
      css={{
        ...css,
        borderRadius: '$4',
        backgroundColor: disabled ? 'transparent' : 'white',
        border: hasError ? '1px solid $dangerBase' : '1px solid $primary200',
      }}
      direction="column"
      elevation="1"
      data-testid="select"
    >
      <SelectPrimitive.Root disabled={disabled} {...props}>
        {children}
      </SelectPrimitive.Root>
    </StyledBox>
  );
};

export const SelectPortal = styled(SelectPrimitive.Portal);
export const SelectItemText = styled(SelectPrimitive.ItemText);
