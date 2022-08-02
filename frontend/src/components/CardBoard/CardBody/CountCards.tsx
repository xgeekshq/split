import Text from 'components/Primitives/Text';
import { countBoardCards } from 'helper/board/countCards';
import ColumnType from 'types/column';

type CounCardsProps = {
	columns: ColumnType[];
};

const CountCards = ({ columns }: CounCardsProps) => {
	const countCards = countBoardCards(columns);

	return (
		<Text css={{ ml: '$40' }} size="sm" weight="medium">
			{columns.length} columns, {countCards} cards
		</Text>
	);
};

export default CountCards;
