import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { styled } from "../../stitches.config";
import { ColumnBoardType, ColumnInnerList } from "../../types/column";
import Flex from "../Primitives/Flex";
import Shape from "../Primitives/Shape";
import Text from "../Primitives/Text";
import CardBoard from "./CardBoard";
import { useStoreContext } from "../../store/store";

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

const InnerList = React.memo<ColumnInnerList>(({ cards, cardsOrder, color, columns }) => {
  return (
    <>
      {cardsOrder.map((cardId: string, idx) => {
        const card = cards.find((c) => c._id === cardId);
        if (!card) return null;
        return <CardBoard key={card._id} card={card} index={idx} color={color} columns={columns} />;
      })}
    </>
  );
});

const Column: React.FC<ColumnBoardType> = ({ column, index }) => {
  const {
    state: { board },
  } = useStoreContext();
  if (!column || !column._id) return null;
  return (
    <Draggable draggableId={column._id} index={index}>
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
              {column.title}
            </Title>
          </Circle>
          {column._id && (
            <Droppable droppableId={column._id} type="CARD">
              {(prov) => (
                <CardsList direction="column" ref={prov.innerRef} {...prov.droppableProps}>
                  {board?.columns && (
                    <InnerList
                      cards={board.cards}
                      color={column.color}
                      cardsOrder={column.cardsOrder}
                      columns={board.columns}
                    />
                  )}
                  {prov.placeholder}
                </CardsList>
              )}
            </Droppable>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
