import { styled } from '@/styles/stitches/stitches.config';

import EmptyTeamsImage from '@/components/images/EmptyTeams';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

const StyledImage = styled(EmptyTeamsImage, Flex, Box, { '& svg': { zIndex: '-1' } });

const StyledBox = styled(Flex, Box, {
  position: 'relative',
  width: '100%',
  mt: '$14',
  backgroundColor: 'white',
  pt: '$48',
  borderRadius: '$12',
});

const EmptyBoardsText = styled(Text, {
  mb: '48px',
});

const StyledNewTeamLink = styled('a', Text, { cursor: 'pointer' });

export { EmptyBoardsText, StyledBox, StyledImage, StyledNewTeamLink };
