import * as SelectPrimitive from '@radix-ui/react-select';
import { styled } from '@stitches/react';
import { mauve } from '@radix-ui/colors';

export const SelectTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 4,
  fontSize: '$16',
  lineHeight: '$24',
  backgroundColor: 'white',
  color: '$primary800',
  width: '100%',
  py: '$12',
  pl: '$17',
  pr: '$16',
  '&[data-placeholder]': {
    fontSize: 13,
    color: '$primary400',
  },
});

export const SelectIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$primary400',
});

export const SelectContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: 'white',
});

export const SelectViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

export const StyledItem = styled(SelectPrimitive.Item, {
  fontSize: 16,
  lineHeight: 1,
  color: '$primary400',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: '$primary400',
    color: 'white',
  },
});

export const SelectLabel = styled(SelectPrimitive.Label, {
  padding: '0 25px',
  fontSize: 12,
  lineHeight: '25px',
  color: mauve.mauve11,
});

export const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledRootSelect = styled(SelectPrimitive.Root);
const StyledSelectValue = styled(SelectPrimitive.Value, {
  color: '$primary700',
  fontSize: '16px',
});
const StyledSelectPortal = styled(SelectPrimitive.Portal);
const StyleSelectItemText = styled(SelectPrimitive.ItemText);
const StyleSelectItemIndicator = styled(SelectPrimitive.ItemIndicator);

export const Select = StyledRootSelect;
export const SelectValue = StyledSelectValue;
export const SelectPortal = StyledSelectPortal;
export const SelectItemText = StyleSelectItemText;
export const SelectItemIndicator = StyleSelectItemIndicator;
