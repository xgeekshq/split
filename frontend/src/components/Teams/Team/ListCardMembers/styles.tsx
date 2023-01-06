import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Flex';

const ScrollableContent = styled(Flex, {
  mt: '$24',
  maxHeight: 'calc(100vh - 180px)',
  overflowY: 'auto',
  pb: '$40',
  pr: '$10',
  mb: '$10',
});

export { ScrollableContent };
