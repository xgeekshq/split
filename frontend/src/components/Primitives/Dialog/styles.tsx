import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

const ButtonAddMember = styled('button', {
  color: 'black',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  border: 0,
  fontSize: '13px',
  '&:hover': {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  marginTop: '10px',
});

const ScrollableContent = styled(Flex, {
  mt: '$24',
  height: 'calc(100vh - 390px)',
  overflowY: 'auto',
  pr: '$10',
  pb: '$10',
});

const PlaceholderText = styled(Text, {
  color: '$primary300',
  position: 'absolute',
  pointerEvents: 'none',
  transformOrigin: '0 0',
  transition: 'all .2s ease-in-out',
  p: '$16',
  '&[data-iconposition="left"]': {
    pl: '$57',
  },
  '&[data-iconposition="right"]': {
    pl: '$17',
  },
});

const IconWrapper = styled(Flex, {
  position: 'absolute',
  top: '$16',
  left: 'none',
  right: 'none',
  cursor: 'default',
  '&[data-iconposition="left"]': {
    left: '$16',
  },
  '&[data-iconposition="right"]': {
    right: '$16',
  },
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
  boxSizing: 'border-box',
  margin: '0',
  outlineOffset: '0',
  padding: '0',
  fontFamily: '$body',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  backgroundColor: '$white',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  '&:-internal-autofill-selected': {
    backgroundColor: '$white',
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

  display: 'flex',
  fontSize: '$16',
  px: '$16',
  boxShadow: '0',
  border: '1px solid $primary200',
  outline: 'none',
  width: '100%',
  borderRadius: '$4',
  lineHeight: '$20',
  height: '$56',
  pt: '$28',
  pb: '$8',
  '&::-webkit-input-placeholder': {
    fontSize: '22px !important',
    color: '$primary300',
  },
  '&:disabled': {
    backgroundColor: '$primary50',
  },
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

  '&[data-iconposition="left"]': {
    pl: '$56',
    '&:not(:placeholder-shown) ~ label': {
      transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`,
    },
    '&:focus ~ label': {
      transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`,
    },
  },

  '&[data-iconposition="right"]': {
    pr: '$56',
  },
});

export { ButtonAddMember, IconWrapper, PlaceholderText, ScrollableContent, StyledInput };
