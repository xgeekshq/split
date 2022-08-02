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
			<Text color="primary300" size="sm">
				Sub-team boards{' '}
			</Text>
			<Separator
				css={{ ml: '$8', backgroundColor: '$primary300', height: '$12 !important' }}
				orientation="vertical"
			/>
			<Text color="primary800" css={{ display: 'flex', ml: '$8' }} size="md">
				{countDividedBoards}{' '}
				<Flex css={{ ml: '$8', cursor: 'pointer' }} onClick={handleOpenSubBoards}>
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
