import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const StyledSidebar = styled('aside', {
  overflowY: 'auto',
  position: 'fixed', // Position fixed avoiding problems with scrolls
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '$primary800',
  zIndex: 9999,
  height: '100vh',

  variants: {
    collapsed: {
      true: { width: '100%', height: '$82' },
      false: { '@md': { width: '$256', height: '100vh' } },
    },
  },
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

const CollapsibleContent = styled(Flex, {
  variants: {
    collapsed: {
      true: { display: 'none' },
      false: { display: 'flex' },
    },
  },
});

export { StyledSidebar, StyledMenuItem, CollapsibleContent };
