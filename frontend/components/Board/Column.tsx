import { Droppable } from "react-beautiful-dnd";
import { styled } from "../../stitches.config";
import { CardType, ColumnContentType } from "../../types/boardTypes";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import CardBoard from "./CardBoard";

const Container = styled(Flex, {
  m: "$8",
  border: "1px solid lightgrey",
  borderRadius: "$2",
});

const Title = styled(Text, {
  p: "$8",
});

const CardsList = styled(Flex, { p: "$8" });

const Column: React.FC<{ title: string; column: ColumnContentType; cards: CardType }> = ({
  title,
  cards,
}) => {
  return (
    <Container direction="column">
      <Title size="18" fontWeight="bold">
        {title}
      </Title>
      <Droppable droppableId={title}>
        {(provided) => (
          <CardsList
            direction="column"
            gap="8"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Object.keys(cards).map((key, index) => {
              return <CardBoard index={index} cardId={key} card={cards[key]} />;
            })}
            {provided.placeholder}
          </CardsList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
