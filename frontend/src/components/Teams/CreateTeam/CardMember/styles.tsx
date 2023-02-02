import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Flex';
import Box from '@/components/Primitives/Box';
import Text from '@/components/Primitives/Text';

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
  wordBreak: 'break-word',
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

export { IconButton, InnerContainer, StyledMemberTitle };
