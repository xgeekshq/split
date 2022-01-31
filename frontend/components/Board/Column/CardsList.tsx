import React from "react";
import CardType from "../../../types/card/card";
import { ColumnInnerList } from "../../../types/column";
import CardBoard from "../Card/CardBoard";

const CardsList = React.memo<ColumnInnerList>(
  ({ cards, color, colId, userId, boardId, socketId }) => {
    return (
      <>
        {cards.map((card: CardType, idx) => {
          return (
            <CardBoard
              key={card._id}
              card={card}
              index={idx}
              isPreview={false}
              color={color}
              colId={colId}
              userId={userId}
              boardId={boardId}
              socketId={socketId}
            />
          );
        })}
      </>
    );
  }
);

export default CardsList;
