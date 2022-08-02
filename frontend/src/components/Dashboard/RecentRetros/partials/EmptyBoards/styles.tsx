import { styled } from 'styles/stitches/stitches.config';

import EmptyBoardsImage from 'components/images/EmptyBoards';
import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';

const StyledImage = styled(EmptyBoardsImage, Flex, Box, { '& svg': { zIndex: '-1' } });

const StyledBox = styled(Flex, Box, {
	position: 'relative',
	width: '100%',
	mt: '$14',
	backgroundColor: 'white',
	pt: '$48',
	borderRadius: '$12'
});

const EmptyBoardsText = styled(Text, {
	mb: '48px'
});

const StyledNewBoardLink = styled('a', Text, { cursor: 'pointer' });

export { EmptyBoardsText, StyledBox, StyledImage, StyledNewBoardLink };
