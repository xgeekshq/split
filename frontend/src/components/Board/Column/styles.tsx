import { styled } from '@/styles/stitches/stitches.config';

import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

const CardsContainer = styled(Flex, {
  mt: '$20',
  px: '$20',
  overflowX: 'hidden',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 450px)',

  '&::-webkit-scrollbar': {
    width: '$4',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '$pill',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '$primary200',
    borderRadius: '$pill',

    '&:hover': {
      background: '$primary400',
    },
  },
});

const Container = styled(Flex, Box, {
  borderRadius: '$12',
  flexShrink: 0,
  flex: '1',
  pb: '$24',
  width: '100%',
  boxShadow: '0px 2px 8px rgba(18, 25, 34, 0.05)',
  backgroundColor: '$surface',
});

const OuterContainer = styled(Flex, {
  height: 'fit-content',

  flex: '1',
  flexGrow: 1,
  flexShrink: 0,
  width: '100%',
});

const Title = styled(Text, {
  px: '$8',
});

export { CardsContainer, Container, OuterContainer, Title };
