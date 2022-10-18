import Link from 'next/link';
import { styled } from 'styles/stitches/stitches.config';
import Text from 'components/Primitives/Text';

type CardTitleProps = {
	title: string;
	teamId: string;
};

const StyledBoardTitle = styled(Text, {
	fontWeight: '$bold',
	fontSize: '$14',
	letterSpacing: '$0-17',
	'&[data-disabled="true"]': { opacity: 0.4 },
	'@hover': {
		'&:hover': {
			'&[data-disabled="true"]': {
				textDecoration: 'none',
				cursor: 'default'
			},
			textDecoration: 'underline',
			cursor: 'pointer'
		}
	}
});

const CardTitle: React.FC<CardTitleProps> = ({ teamId, title }) => {
	const getTitle = () => {
		return (
			<Link
				key={teamId}
				href={{
					pathname: `teams/[teamId]`
					//query: isSubBoard ? { boardId, mainBoardId } : { boardId }
				}}
			>
				<StyledBoardTitle>{title}</StyledBoardTitle>
			</Link>
		);
	};

	return getTitle();
};

export default CardTitle;
