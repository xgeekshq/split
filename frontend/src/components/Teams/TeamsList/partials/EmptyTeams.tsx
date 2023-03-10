import { styled } from '@/styles/stitches/stitches.config';
import Link from 'next/link';

import Text from '@/components/Primitives/Text';
import Box from '@/components/Primitives/Layout/Box';
import Flex from '@/components/Primitives/Layout/Flex';

import EmptyTeamsImage from '@/components/images/EmptyTeams';

const StyledBox = styled(Flex, Box, {
  position: 'relative',
  borderRadius: '$12',
  backgroundColor: 'white',
  mt: '$14',
  p: '$48',
});

const EmptyTeams = () => (
  <StyledBox
    align="center"
    direction="column"
    elevation="1"
    justify="center"
    data-testid="emptyTeams"
  >
    <EmptyTeamsImage />
    <Text css={{ mt: '$40', textAlign: 'center' }} size="md">
      <Link href="/teams/new">
        <Text link fontWeight="medium">
          Create your first team
        </Text>
      </Link>{' '}
      now.
    </Text>
  </StyledBox>
);
export default EmptyTeams;
