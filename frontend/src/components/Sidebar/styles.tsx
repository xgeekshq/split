import { styled } from '@/styles/stitches/stitches.config';
import Flex from '../Primitives/Layout/Flex/Flex';

const StyledSidebar = styled('aside', {
  width: '256px',
  height: '100%',
  overflowY: 'auto',
  position: 'fixed', // Position fixed avoiding problems with scrolls
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '$primary800',
});

const StyledMenuItem = styled(Flex, {
  pl: '$22',
  py: '$12',
  height: '$48',
  gap: '$14',
  alignItems: 'center',
  transition: 'all 0.3s',
  '& svg': {
    color: '$primary300',
    width: '$24',
    height: '$24',
  },
  '&[data-active="true"]': {
    backgroundColor: '$primary600',
    '& svg': {
      color: '$white',
    },
    '& span': {
      color: '$white',
      fontWeight: '$medium',
    },
  },
  '&:hover': {
    cursor: 'pointer',
    '&:not(&[data-active="true"])': {
      backgroundColor: '$primary700',
      '& svg': {
        color: '$primary200',
      },
      '& span': {
        color: '$primary200',
        fontWeight: '$medium',
      },
    },
  },
  variants: {
    disabled: {
      true: {
        '&:hover': {
          cursor: 'not-allowed',
        },
      },
    },
  },
});

export { StyledSidebar, StyledMenuItem };
