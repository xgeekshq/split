import React from 'react';

import CardBoard from '@/components/Board/Card/CardBoard';
import CardType from '@/types/card/card';
import { ColumnInnerList } from '@/types/column';

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
          cardTextDefault={cardTextDefault}
          colId={colId}
          color={color}
          hasAdminRole={hasAdminRole}
          hideCards={hideCards}
          index={idx}
          isDefaultText={isDefaultText || true}
          isMainboard={isMainboard}
          isRegularBoard={isRegularBoard}
          isSubmited={isSubmited}
          maxVotes={maxVotes}
          phase={phase}
          postAnonymously={postAnonymously}
          socketId={socketId}
          userId={userId}
        />
      ))}
    </>
  ),
);

export default CardsList;
