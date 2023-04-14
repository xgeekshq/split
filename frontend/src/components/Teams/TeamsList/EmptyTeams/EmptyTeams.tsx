import Link from 'next/link';

import EmptyTeamsImage from '@/components/images/EmptyTeams';
import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

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
    data-testid="emptyTeams"
    direction="column"
    elevation="1"
    justify="center"
  >
    <EmptyTeamsImage />
    <Text css={{ mt: '$40', textAlign: 'center' }} size="md">
      <Link href="/teams/new">
        <Text link underline fontWeight="medium">
          Create your first team
        </Text>
      </Link>{' '}
      now.
    </Text>
  </StyledBox>
);
export default EmptyTeams;
