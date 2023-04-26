import Text from '@/components/Primitives/Text/Text';
import { countBoardCards } from '@/helper/board/countCards';
import ColumnType from '@/types/column';

type CounCardsProps = {
  columns: ColumnType[];
};

const CountCards = ({ columns }: CounCardsProps) => {
  const countCards = countBoardCards(columns);

  return (
    <Text css={{ textAlign: 'end' }} fontWeight="medium" size="sm">
      <span style={{ whiteSpace: 'nowrap' }}>{columns.length} columns,</span>{' '}
      <span style={{ whiteSpace: 'nowrap' }}>{countCards} cards</span>
    </Text>
  );
};

export default CountCards;
