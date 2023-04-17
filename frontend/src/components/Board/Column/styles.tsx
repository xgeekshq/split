import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

const CardsContainer = styled(Flex, {
  mt: '$20',
  mb: '$8',
  px: '$20',

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
  width: '100%',
  boxShadow: '0px 2px 8px rgba(18, 25, 34, 0.05)',
  backgroundColor: '$surface',
});

const OuterContainer = styled(Flex, {
  height: 'fit-content',
  flex: '1 1 0',
  flexGrow: 1,
  flexShrink: 0,
  width: '100%',
});

const TitleContainer = styled(Flex, {
  '@media (min-width: 1750px)': { width: 'fit-content !important' },
  '@media (max-width: 1300px)': { width: '$150 !important' },
});

const Title = styled(Text, {
  px: '$8',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  '@hover': {
    cursor: 'default',
  },
});

export { CardsContainer, Container, OuterContainer, Title, TitleContainer };
