import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const ScrollableContent = styled(Flex, {
  py: '$24',
  height: '100%',
  overflowY: 'auto',
  pr: '$10',
});

export { ScrollableContent };
