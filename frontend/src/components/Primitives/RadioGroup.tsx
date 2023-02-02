import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from '@/styles/stitches/stitches.config';

const RadioGroupRoot = styled(RadioGroup.Root, {
  display: 'flex',
  flexDirection: 'row',
  gap: '$10',
  justifyContent: 'space-between',
});

const RadioGroupItem = styled(RadioGroup.Item, {
  all: 'unset',
  backgroundColor: '$background',
  width: '$16',
  height: '$16',
  borderRadius: '100%',
  margin: '$4 $10',
  '&[data-state="unchecked"]': {
    width: '$14',
    height: '$14',
    border: '1px solid $colors$primary300',
  },
});

const RadioGroupIndicator = styled(RadioGroup.Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
  '&::after': {
    content: '',
    display: 'block',
    width: '$8',
    height: '$8',
    borderRadius: '50%',
    border: '4px solid $primary800',
  },
});

const Label = styled('label', {
  userSelect: 'none',
  cursor: 'pointer',
  variants: {
    size: {
      lg: {
        fontSize: '$20',
        lineHeight: '$28',
      },
      md: {
        fontSize: '$16',
        lineHeight: '$24',
      },
      sm: {
        fontSize: '$14',
        lineHeight: '$20',
      },
    },
    fontWeight: {
      regular: {
        fontWeight: '$regular',
      },
      medium: {
        fontWeight: '$medium',
      },
      bold: {
        fontWeight: '$bold',
      },
    },
  },
});

export { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label };
