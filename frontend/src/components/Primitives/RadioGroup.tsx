import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from '@stitches/react';

const RadioGroupRoot = styled(RadioGroup.Root, {
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
  justifyContent: 'space-between',
});

const RadioGroupItem = styled(RadioGroup.Item, {
  all: 'unset',
  backgroundColor: '$background',
  width: 15,
  height: 15,
  borderRadius: '100%',
  border: '1px solid $colors$primary300',
});

const RadioGroupIndicator = styled(RadioGroup.Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',

  '&::after': {
    content: '""',
    display: 'block',
    width: 11,
    height: 11,
    borderRadius: '50%',
    background: '$primary800',
  },
});

const Label = styled('label', {
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
  paddingLeft: 15,
});

export { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label };
