import Link from 'next/link';

import { EmptyBoardsText, StyledBox, StyledImage, StyledNewBoardLink } from './styles';

const EmptyBoards: React.FC = () => {
	return (
		<StyledBox align="center" direction="column" elevation="1" justify="center">
			<StyledImage />
			<EmptyBoardsText css={{ mt: '$24', textAlign: 'center' }} size="md">
				You have not participated in any retro yet.
				<br />
				<Link href="/boards/new">
					<StyledNewBoardLink underline weight="medium">
						Add a new retro board
					</StyledNewBoardLink>
				</Link>{' '}
				now.
			</EmptyBoardsText>
		</StyledBox>
	);
};
export default EmptyBoards;
