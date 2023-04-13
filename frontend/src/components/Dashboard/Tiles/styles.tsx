import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const TileContainer = styled(Flex, {
  gap: '$29',
  flexWrap: 'wrap',

  '> *': { flexGrow: 1 },
});

export { TileContainer };
