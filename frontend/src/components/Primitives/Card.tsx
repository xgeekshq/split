import { styled } from '@/styles/stitches/stitches.config';

import Flex from './Flex';

const Card = styled(Flex, {
  lineHeight: '$24',
  border: '1px solid $colors$blackA10',
  backgroundColor: 'White',
  variants: {
    radius: {
      40: {
        borderRadius: '$40',
      },
    },
    interactive: {
      '@hover': {
        '&:hover': { boxShadow: '10px 10px 20px 1px rgba(0,0,0,.2)' },
      },
      clickable: {
        '@hover': {
          '&:hover': {
            borderColor: '$blue10',
          },
        },
      },
    },
  },
});

export default Card;
