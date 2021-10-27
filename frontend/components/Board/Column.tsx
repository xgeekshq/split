import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { styled } from "../../stitches.config";
import { CardType, ColumnType } from "../../types/boardTypes";
import Flex from "../Primitives/Flex";
import Shape from "../Primitives/Shape";
import Text from "../Primitives/Text";
import CardBoard from "./CardBoard";
import { UNDEFINED } from "../../utils/constantsHelper";

const Container = styled(Flex, {
  borderRadius: "$2",
  flexShrink: 0,
  flexBasis: 0,
  flexGrow: 1,
  gap: "$16",
});

const Circle = styled(Shape, {
  size: "6rem",
  alignSelf: "center",
});

const Title = styled(Text, {
  px: "$8",
});

const CardsList = styled(Flex, { p: "$8", flexGrow: 1, height: "80vh" });

const InnerList = React.memo<{ columns: ColumnType[]; cards: CardType[]; color: string }>(
  ({ cards, color, columns }) => {
    return (
      <>
        {cards.map((card, idx) => {
          return (
            <CardBoard
              key={card.id}
              columns={columns}
              index={idx}
              cardId={card?.id ?? UNDEFINED}
              card={card}
              color={color}
            />
          );
        })}
      </>
    );
  }
);

const Column: React.FC<{
  title: string;
  column: ColumnType;
  cards: CardType[];
  index: number;
  columns: ColumnType[];
}> = ({ title, cards, column, index, columns }) => {
  return (
    <Draggable draggableId={column.id ?? UNDEFINED} index={index}>
      {(provided) => (
        <Container {...provided.draggableProps} direction="column" ref={provided.innerRef}>
          <Circle
            variant="circle"
            justify="center"
            align="center"
            css={{ backgroundColor: column.color }}
            {...provided.dragHandleProps}
          >
            <Title color="white" size="18" fontWeight="bold">
              {title}
            </Title>
          </Circle>
          <Droppable droppableId={column.id ?? UNDEFINED} type="card">
            {(prov) => (
              <CardsList direction="column" ref={prov.innerRef} {...prov.droppableProps}>
                <InnerList columns={columns} cards={cards} color={column.color} />
                {prov.placeholder}
              </CardsList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
