import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';

type CenterMainBoardProps = {
	countDividedBoards: number;
	handleOpenSubBoards: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	openSubBoards: boolean;
};

const CenterMainBoard = ({
	countDividedBoards,
	handleOpenSubBoards,
	openSubBoards
}: CenterMainBoardProps) => {
	return (
		<Flex css={{ ml: '$40', display: 'flex', alignItems: 'center' }}>
			<Text size="sm" color="primary300">
				Sub-team boards{' '}
			</Text>
			<Separator
				orientation="vertical"
				css={{ ml: '$8', backgroundColor: '$primary300', height: '$12 !important' }}
			/>
			<Text size="md" color="primary800" css={{ display: 'flex', ml: '$8' }}>
				{countDividedBoards}{' '}
				<Flex onClick={handleOpenSubBoards} css={{ ml: '$8', cursor: 'pointer' }}>
					<Icon
						name={`arrow-${!openSubBoards ? 'down' : 'up'}`}
						css={{
							width: '$24',
							height: '$24'
						}}
					/>
				</Flex>
			</Text>
		</Flex>
	);
};

export default CenterMainBoard;
