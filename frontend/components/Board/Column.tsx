import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { styled } from "../../stitches.config";
import { ColumnBoardType, ColumnInnerList } from "../../types/column/column";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import CardBoard from "./Card/CardBoard";
import { useStoreContext } from "../../store/store";
import CardType, { CardDragItem } from "../../types/card/card";
import UpdateCardPositionDto from "../../types/card/updateCardPosition.dto";
import { UPDATE_CARD_POSITION } from "../../utils/constants";
import useBoard from "../../hooks/useBoard";

const Container = styled(Flex, {
  borderRadius: "$8",
  height: "fit-content",
  flex: "1",
  gap: "$16",
  px: "$16",
  pb: "$16",
  boxShadow: "1px 2px 2px rgba(0, 0, 0, 0.25)",
});

const Title = styled(Text, {
  px: "$8",
});

const InnerList = React.memo<ColumnInnerList>(({ cards, color, colId, userId }) => {
  return (
    <>
      {cards.map((card: CardType, idx) => {
        if (!card.items || card.items.length === 1) {
          return (
            <CardBoard
              key={card._id}
              card={card}
              index={idx}
              isPreview={false}
              color={color}
              colId={colId}
              cardGroupId={undefined}
              userId={userId}
            />
          );
        }
        return null;
      })}
    </>
  );
});

const Column: React.FC<ColumnBoardType> = ({ column, index, userId }) => {
  const {
    state: { board, socket, action },
    dispatch,
  } = useStoreContext();

  const { updateCardPosition } = useBoard(
    { autoFetchBoard: false, autoFetchBoards: false },
    board?._id
  );

  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ["COLUMN", "CARD", "CARD_GROUP"],
    hover(item: CardDragItem, monitor) {
      if (!board?._id || !socket?.id || item.columnId === column._id) return;

      if (!monitor.isOver({ shallow: true })) return;

      if (!item.cardGroupId) {
        const changes: UpdateCardPositionDto = {
          oldColumnId: item.columnId,
          targetColumnId: column._id,
          newPosition: column.cards.length,
          oldPosition: item.index,
          cardId: item.id,
          boardId: board._id,
          socketId: socket.id,
        };
        const newAction = { type: UPDATE_CARD_POSITION, changes };
        item.columnId = column._id;
        item.index = column.cards.length;
        dispatch({ type: UPDATE_CARD_POSITION, val: newAction });
      }
    },
    drop() {
      switch (action?.type) {
        case UPDATE_CARD_POSITION:
          updateCardPosition.mutate(action.changes);
          break;
        default:
          break;
      }
    },
  });

  drop(ref);
  return (
    <Container
      direction="column"
      ref={ref}
      css={{ backgroundColor: column.color, mr: index !== 2 ? "$8" : "" }}
    >
      <Title size="18" fontWeight="bold">
        {column.title}
      </Title>
      <InnerList cards={column.cards} color={column.color} colId={column._id} userId={userId} />
    </Container>
  );
};

export default Column;
