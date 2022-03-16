import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { styled } from "../../../stitches.config";
import { ColumnBoardType } from "../../../types/column";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import AddCard from "../Card/AddCard";
import CardsList from "./CardsList";

const Container = styled(Flex, {
  borderRadius: "$8",
  height: "fit-content",
  flexShrink: 0,
  flex: "1",
  pb: "$40",
  px: "$24",
  width: "100%",
});

const OuterContainer = styled(Flex, {
  height: "fit-content",
  flex: "1",
  flexGrow: 1,
  flexShrink: 0,
  width: "100%",
});

const Title = styled(Text, {
  px: "$8",
});

const Column = React.memo<ColumnBoardType>(
  ({ columnId, cards, userId, boardId, title, color, socketId }) => {
    return (
      <OuterContainer>
        <Droppable droppableId={columnId} type="CARD" isCombineEnabled>
          {(provided) => (
            <Container direction="column" css={{ backgroundColor: color }}>
              <Title>{title}</Title>
              <AddCard colId={columnId} boardId={boardId} socketId={socketId} />
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CardsList
                  cards={cards}
                  color={color}
                  colId={columnId}
                  userId={userId}
                  boardId={boardId}
                  socketId={socketId}
                />
                {provided.placeholder}
              </div>
            </Container>
          )}
        </Droppable>
      </OuterContainer>
    );
  }
);
export default Column;
