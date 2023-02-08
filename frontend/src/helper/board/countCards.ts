import CardType from '@/types/card/card';
import ColumnType from '@/types/column';

export const countBoardCards = (columns: ColumnType[]) =>
  columns.reduce((acc, column) => {
    column.cards.forEach((card) => {
      acc += card.items.length;
    });
    return acc;
  }, 0);

export const countColumnCards = (cards: CardType[]) =>
  cards.reduce((acc, card) => {
    acc += card.items.length;
    return acc;
  }, 0);
