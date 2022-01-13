import { useRef } from "react";
import { useDrop, XYCoord } from "react-dnd";
import { styled } from "../../../stitches.config";
import Card from "../../Primitives/Card";
import { useStoreContext } from "../../../store/store";
import useItemDrag from "../../../hooks/useItemDrag";
import isHidden from "../../../utils/isHidden";
import Text from "../../Primitives/Text";
import CardType, { CardDragItem } from "../../../types/card/card";
import { UPDATE_CARD_POSITION } from "../../../utils/constants";
import UpdateCardPositionDto from "../../../types/card/updateCardPosition.dto";

const Container = styled(Card, {
  borderRadius: "$2",
  p: "$8",
  wordBreak: "breakWord",
});

interface CardBoardProps {
  color: string;
  card: CardType;
  index: number;
  colId: string;
  isPreview: boolean;
  cardGroupId?: string;
  userId: string;
}

const CardBoard: React.FC<CardBoardProps> = ({
  card,
  index,
  color,
  colId,
  isPreview,
  cardGroupId,
  userId,
}) => {
  const {
    state: { board, socket },
    dispatch,
  } = useStoreContext();

  const ref = useRef<HTMLDivElement>(null);

  const { item: draggedItem, drag } = useItemDrag({
    type: "CARD",
    id: card._id,
    card,
    index,
    columnId: colId,
    color,
    userId,
    cardGroupId,
  });

  const [, drop] = useDrop({
    accept: ["CARD", "CARD_GROUP"],
    hover(item: CardDragItem, monitor) {
      if (!board?._id || !socket?.id || item.id === card._id) return;

      if (!monitor.isOver({ shallow: true })) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      if (hoverBoundingRect) {
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();

        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        if (!item.cardGroupId) {
          const changes: UpdateCardPositionDto = {
            oldColumnId: item.columnId,
            targetColumnId: colId,
            newPosition: hoverIndex,
            oldPosition: item.index,
            cardId: item.id,
            boardId: board._id,
            socketId: socket.id,
          };
          const newAction = { type: UPDATE_CARD_POSITION, changes };

          if (item.cardGroupId) item.cardGroupId = undefined;
          item.index = hoverIndex;
          item.columnId = colId;
          dispatch({ type: UPDATE_CARD_POSITION, val: newAction });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  drag(drop(ref));
  return (
    <Container
      ref={ref}
      aria-roledescription="Press space bar to lift the task"
      direction="column"
      css={{
        transform: isPreview ? "rotate(5deg)" : undefined,
        opacity: card._id && isHidden(isPreview, draggedItem, "CARD", card._id) ? 0.2 : 1,
        border: "none",
        cursor: "grab",
        borderRadius: "$6",
        boxShadow: "1px 2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Text css={{ wordBreak: "break-word" }}>{card.text}</Text>
    </Container>
  );
};

export default CardBoard;
