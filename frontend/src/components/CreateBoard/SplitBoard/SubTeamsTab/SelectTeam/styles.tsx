import Flex from '@/components/Primitives/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const HelperTextWrapper = styled(Flex, {
  '& svg': {
    flex: '0 0 16px',
    height: '$16 ',
    width: '$16 ',
    color: '$dangerBase',
  },
  '& *:not(svg)': { flex: '1 1 auto' },
});

export { HelperTextWrapper };
