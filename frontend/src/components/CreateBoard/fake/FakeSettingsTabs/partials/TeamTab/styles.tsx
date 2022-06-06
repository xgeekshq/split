import { styled } from 'styles/stitches/stitches.config';

import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';

const StyledBox = styled(Flex, Box, { borderRadius: '$12', backgroundColor: 'white' });

export { StyledBox };
