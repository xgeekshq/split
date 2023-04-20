import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const BannerContainer = styled(Flex, {
  padding: '$18 $22',
  justifyContent: 'space-between',

  '@md': {
    padding: '$40',
    justifyContent: 'center',
  },
});

const MenuButton = styled(Button, {
  color: '$white !important',

  '@md': { display: 'none' },
});

export { BannerContainer, MenuButton };
