import { countBoardCards } from '../../../helper/board/countCards';
import ColumnType from '../../../types/column';
import Text from '../../Primitives/Text';

type CounCardsProps = {
	columns: ColumnType[];
};

const CountCards = ({ columns }: CounCardsProps) => {
	const countCards = countBoardCards(columns);

	return (
		<Text size="sm" weight="medium" css={{ ml: '$40' }}>
			{columns.length} columns, {countCards} cards
		</Text>
	);
};

export default CountCards;
