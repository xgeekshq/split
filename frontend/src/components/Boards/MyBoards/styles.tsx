import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const ScrollableContent = styled(Flex, {
  mt: '$24',
  height: 'calc(100vh - 180px)',
  overflowY: 'auto',
  pb: '$40',
  pr: '$10',
});

export { ScrollableContent };
