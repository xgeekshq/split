import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

const StyledInputWrapper = styled(Flex, {
  px: '$16',
  boxShadow: '0',
  border: '1px solid $primary200',
  outline: 'none',
  borderRadius: '$4',
  backgroundColor: '$white',
  alignItems: 'center',
  variants: {
    variant: {
      default: {
        '&:focus': {
          borderColor: '$primary400',
          boxShadow: '0px 0px 0px 2px $colors$primaryLightest',
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest',
        },
      },
      valid: {
        borderColor: '$success700',
        boxShadow: '0px 0px 0px 2px $colors$successLightest',
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest',
        },
      },
      error: {
        borderColor: '$danger700',
        boxShadow: '0px 0px 0px 2px $colors$dangerLightest',
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$dangerLightest',
        },
      },
    },
    disabled: {
      true: {
        backgroundColor: '$primary50',
      },
    },
  },
});

const PlaceholderText = styled(Text, {
  color: '$primary300',
  position: 'absolute',
  pointerEvents: 'none',
  transformOrigin: '0 0',
  transition: 'all .2s ease-in-out',
  py: '$16',
});

const IconWrapper = styled(Flex, {
  alignItems: 'center',
  cursor: 'default',
  p: '$2',
  '&[data-type="password"]': {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const StyledInput = styled('input', {
  // Reset
  appearance: 'none',
  borderWidth: '0',
  boxShadow: '0',
  boxSizing: 'border-box',
  margin: '0',
  outlineOffset: '0',
  padding: '0',
  fontFamily: '$body',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  backgroundColor: '$transparent',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  '&:-internal-autofill-selected': {
    backgroundColor: '$transparent',
  },

  '&:-webkit-autofill,&:-webkit-autofill:active,&:-webkit-autofill:focus': {
    '-webkit-box-shadow': '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest',
  },

  '&:-webkit-autofill::first-line': {
    color: '$dangerBase',
    fontFamily: '$body',
    fontSize: '$16',
  },

  ':-internal-autofill-previewed': {
    fontFamily: '$body',
    fontSize: '$16',
  },

  // Custom
  fontSize: '$16',
  lineHeight: '$20',
  outline: 'none',
  width: '100%',
  height: '$56',
  pt: '$28',
  pb: '$8',
  '&::-webkit-input-placeholder': {
    color: '$primary300',
  },
  color: '$primaryBase',
  '&::placeholder': {
    '&:disabled': {
      color: '$primaryBase',
    },
    color: '$primary300',
  },
  '&:not(:placeholder-shown) ~ label': {
    transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`,
  },
  '&:-internal-autofill-selected ~ label': {
    transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`,
  },
  '&:focus ~ label': {
    transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`,
  },
});

export { IconWrapper, PlaceholderText, StyledInputWrapper, StyledInput };
