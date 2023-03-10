import { styled } from '../../../../styles/stitches/stitches.config';
import Flex from '../../../Primitives/Layout/Flex';

const ScrollableContent = styled(Flex, {
  py: '$24',
  height: '100%',
  overflowY: 'auto',
  pr: '$10',
});

export { ScrollableContent };
