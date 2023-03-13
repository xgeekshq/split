import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const Container = styled('main', {
  width: 'calc(100vw - 256px)',
  height: '100vh',

  padding: '$64 $48 $24 $48',
  marginLeft: 'auto',

  overflow: 'hidden',
});

const ContainerTeamPage = styled('main', {
  width: 'calc(100vw - 256px)',
  height: '100vh',
  padding: '$32 $48 $24 $48',
  marginLeft: 'auto',
  overflow: 'hidden',
});

const ContentSection = styled('section', Flex, {
  width: '100%',
  height: '100%',
});

export { Container, ContainerTeamPage, ContentSection };
