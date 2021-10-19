import { Draggable } from "react-beautiful-dnd";
import { styled } from "../../stitches.config";
import { CardTypeContent } from "../../types/boardTypes";
import Card from "../Primitives/Card";

const Container = styled(Card, { borderRadius: "$2" });

const CardBoard: React.FC<{ cardId: string; card: CardTypeContent; index: number }> = ({
  cardId,
  card,
  index,
}) => {
  return (
    <Draggable draggableId={cardId} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {card.text}
        </Container>
      )}
    </Draggable>
  );
};
export default CardBoard;
