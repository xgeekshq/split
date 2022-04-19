import ColumnType from "../../../types/column";
import Text from "../../Primitives/Text";

type CounCardsProps = {
  columns: ColumnType[];
};

const CountCards = ({ columns }: CounCardsProps) => {
  const countCards = columns.reduce((acc, column) => {
    column.cards.forEach((card) => {
      acc += card.items.length;
    });
    return acc;
  }, 0);

  return (
    <Text size="sm" weight="medium" css={{ ml: "$40" }}>
      {columns.length} columns, {countCards} cards
    </Text>
  );
};

export default CountCards;
