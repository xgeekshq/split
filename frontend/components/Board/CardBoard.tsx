import { Draggable } from "react-beautiful-dnd";
import { styled } from "../../stitches.config";
import { ColumnCardType } from "../../types/column";
import Card from "../Primitives/Card";
import Text from "../Primitives/Text";

const Container = styled(Card, {
  borderRadius: "$2",
  height: "$130",
  flexShrink: 0,
  flexGrow: 0,
  p: "$8",
  mb: "$8",
});

const CardBoard: React.FC<ColumnCardType> = ({ cardId, card, index, color, columns }) => {
  return (
    <Draggable key={cardId} draggableId={cardId} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          aria-roledescription="Press space bar to lift the task"
          css={{
            backgroundColor: snapshot.isDropAnimating
              ? columns.find((col) => col._id === snapshot.draggingOver)?.color
              : color,
          }}
        >
          <Text color="white">{card.title}</Text>
        </Container>
      )}
    </Draggable>
  );
};
export default CardBoard;
