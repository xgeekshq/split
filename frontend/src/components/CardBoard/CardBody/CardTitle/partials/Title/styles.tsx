import { styled } from '@stitches/react';

import Text from '@/components/Primitives/Text/Text';

const StyledBoardTitle = styled(Text, {
  fontWeight: '$bold',
  fontSize: '$14',
  letterSpacing: '$0-17',
  '&[data-disabled="true"]': { opacity: 0.4 },

  '&:hover': {
    '&[data-disabled="true"]': {
      textDecoration: 'none',
      cursor: 'default',
    },
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

export { StyledBoardTitle };
