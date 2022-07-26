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

const EmptyBoards: React.FC = () => {
	return (
		<StyledBox align="center" direction="column" elevation="1" justify="center">
			<StyledImage />
			<EmptyBoardsText css={{ mt: '$24', textAlign: 'center' }} size="md">
				You have not participated in any retro yet.
				<br />
				<Text underline weight="medium">
					Add a new retro board
				</Text>{' '}
				now.
			</EmptyBoardsText>
		</StyledBox>
	);
};
export default EmptyBoards;
