import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Flex';
import Box from '@/components/Primitives/Box';
import Text from '@/components/Primitives/Text';
import { PopoverClose, PopoverItem, PopoverTrigger } from '@/components/Primitives/Popover';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  backgroundColor: '$white',
  borderRadius: '$12',
});

const StyledMemberTitle = styled(Text, {
  fontWeight: '$bold',
  fontSize: '$14',
  letterSpacing: '$0-17',
  '&[data-disabled="true"]': { opacity: 0.4 },
});

const PopoverTriggerStyled = styled(PopoverTrigger, {
  variants: {
    disabled: {
      false: {
        '&:hover': {
          backgroundColor: '$primary500',
          color: 'white',
          cursor: 'pointer',
        },
      },
      true: {
        '&:hover': {
          backgroundColor: '$transparent',
        },
      },
    },
  },
  defaultVariants: { disabled: false },
});

const PopoverCloseStyled = styled(PopoverClose, {
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
});

const PopoverItemStyled = styled(PopoverItem, {
  backgroundColor: '$primary50',
  pr: '$16',
  height: '$100',
});

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 25,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$primaryBase',
  backgroundColor: 'white',
  boxShadow: `0 2px 10px $primaryBase`,
});

export {
  IconButton,
  InnerContainer,
  PopoverCloseStyled,
  PopoverItemStyled,
  PopoverTriggerStyled,
  StyledMemberTitle,
};
