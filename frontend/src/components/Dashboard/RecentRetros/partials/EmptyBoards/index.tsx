import Link from 'next/link';

import { EmptyBoardsText, StyledBox, StyledImage, StyledNewBoardLink } from './styles';

const EmptyBoards: React.FC = () => {
	return (
		<StyledBox elevation="1" justify="center" align="center" direction="column">
			<StyledImage />
			<EmptyBoardsText size="md" css={{ mt: '$24', textAlign: 'center' }}>
				You have not participated in any retro yet.
				<br />
				<Link href="/boards/new">
					<StyledNewBoardLink weight="medium" underline>
						Add a new retro board
					</StyledNewBoardLink>
				</Link>{' '}
				now.
			</EmptyBoardsText>
		</StyledBox>
	);
};
export default EmptyBoards;
