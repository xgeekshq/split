import { styled } from '../../../../styles/stitches/stitches.config';
import Flex from '../../../Primitives/Flex';

const ScrollableContent = styled(Flex, {
  mt: '$24',
  maxHeight: 'calc(100vh - 500px)',
  overflowY: 'auto',
  pb: '$10',
});

export { ScrollableContent };
