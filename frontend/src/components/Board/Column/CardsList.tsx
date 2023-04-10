import React from 'react';

import CardType from '@/types/card/card';
import { ColumnInnerList } from '@/types/column';
import CardBoard from '@/components/Board/Card/CardBoard';

type CardListProps = {
  isRegularBoard?: boolean;
  cardTextDefault?: string;
  phase?: string;
} & ColumnInnerList;

const CardsList = React.memo<CardListProps>(
  ({
    cards,
    color,
    colId,
    userId,
    boardId,
    socketId,
    isMainboard,
    boardUser,
    maxVotes,
    isSubmited,
    hideCards,
    isDefaultText,
    hasAdminRole,
    postAnonymously,
    isRegularBoard,
    cardTextDefault,
    phase,
  }) => (
    <>
      {cards.map((card: CardType, idx) => (
        <CardBoard
          key={card._id}
          boardId={boardId}
          boardUser={boardUser}
          card={card}
          colId={colId}
          color={color}
          hideCards={hideCards}
          index={idx}
          isMainboard={isMainboard}
          isSubmited={isSubmited}
          maxVotes={maxVotes}
          socketId={socketId}
          userId={userId}
          isDefaultText={isDefaultText || true}
          hasAdminRole={hasAdminRole}
          postAnonymously={postAnonymously}
          isRegularBoard={isRegularBoard}
          cardTextDefault={cardTextDefault}
          phase={phase}
        />
      ))}
    </>
  ),
);

export default CardsList;
