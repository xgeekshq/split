import { styled } from '@stitches/react';

import Flex from '../Flex';

const AlertStyle = styled(Flex, {
  variants: {
    type: {
      warning: {
        backgroundColor: '$infoLightest',
        border: '1px solid $colors$infoBase',
      },
      error: {
        backgroundColor: '$dangerLightest',
        border: '1px solid $colors$highlight4Base',
      },
      info: {
        backgroundColor: '$infoLightest',
        border: '1px solid $colors$infoBase',
      },
    },
  },

  padding: '16px 40px',
  height: 'fit-content',
  alignItems: 'center',
  border: '1px solid',
  borderRadius: '$12',
  boxShadow: '0px 1px 4px rgba(18, 25, 34, 0.05)',
  boxSizing: 'border-box',
});

const AlertText = styled(Flex, {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '0px',
  marginLeft: '$24',
  gap: '$4',
});

const AlertIconStyle = styled(Flex, {
  '& svg': {
    width: '31px',
    height: '$32',
  },
});

export { AlertIconStyle, AlertStyle, AlertText };
