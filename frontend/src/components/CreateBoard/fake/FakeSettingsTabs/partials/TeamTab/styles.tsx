import { styled } from '@/styles/stitches/stitches.config';

import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';

const StyledBox = styled(Flex, Box, { borderRadius: '$4', border: '1px solid $primary200' });

export { StyledBox };
