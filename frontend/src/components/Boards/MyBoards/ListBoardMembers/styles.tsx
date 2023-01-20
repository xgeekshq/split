import { styled } from '../../../../styles/stitches/stitches.config';
import Flex from '../../../Primitives/Flex';

const ScrollableContent = styled(Flex, {
  py: '$24',
  height: 'calc(100vh - 89px)',
  overflowY: 'auto',
  pr: '$10',
});

export { ScrollableContent };
