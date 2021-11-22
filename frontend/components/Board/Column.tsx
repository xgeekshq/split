import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { styled } from "../../stitches.config";
import { ColumnBoardType, ColumnInnerList } from "../../types/column";
import Flex from "../Primitives/Flex";
import Shape from "../Primitives/Shape";
import Text from "../Primitives/Text";
import CardBoard from "./CardBoard";
import { UNDEFINED } from "../../utils/constants";

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

const InnerList = React.memo<ColumnInnerList>(({ cards, color, columns }) => {
  return (
    <>
      {cards.map((card, idx) => {
        return (
          <CardBoard
            key={card._id}
            columns={columns}
            index={idx}
            cardId={card?._id ?? UNDEFINED}
            card={card}
            color={color}
          />
        );
      })}
    </>
  );
});

const Column: React.FC<ColumnBoardType> = ({ title, cards, column, index, columns }) => {
  return (
    <Draggable draggableId={column._id ?? UNDEFINED} index={index}>
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
          <Droppable droppableId={column._id ?? UNDEFINED} type="card">
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
