import { useMemo } from "react";
import ColumnType from "../../../types/column";
import Text from "../../Primitives/Text";

type CounCardsProps = {
  columns: ColumnType[];
};

const CountCards = ({ columns }: CounCardsProps) => {
  const countCards = useMemo(() => {
    return columns.reduce((acc, column) => {
      column.cards.forEach((card) => {
        card.items.forEach(() => {
          acc++;
        });
      });
      return acc;
    }, 0);
  }, [columns]);

  return (
    <Text size="sm" weight="medium" css={{ ml: "$40" }}>
      {columns.length} columns, {countCards} cards
    </Text>
  );
};

export default CountCards;
