import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const Container = styled('main', {
  width: '100%',
  height: '100vh',
  marginLeft: 'auto',
  overflow: 'auto',
});

const ContentSection = styled('section', Flex, {
  flexGrow: 1,
  mt: '$82',
  padding: '$64 $24 $24',

  '@md': {
    px: '$48',
    ml: '$256',
    mt: 0,
  },
});

export { Container, ContentSection };
