import React, { useState } from "react";
import { Draggable } from "@react-forked/dnd";
import useCards from "../../../hooks/useCards";
import { styled } from "../../../stitches.config";
import CardType from "../../../types/card/card";
import ToastMessage from "../../../utils/toast";
import Card from "../../Primitives/Card";
import Flex from "../../Primitives/Flex";
import DeleteItem from "../Item/DeleteItem";
import EditItem from "../Item/EditItem";
import TextItem from "../Item/TextItem";
import UpdateItem from "../Item/UpdateItem";
import CardFooter from "./CardFooter";
import SideBard from "./SideBar";

const Container = styled(Card, {
  p: "$8",
  mt: "$16",
  wordBreak: "breakWord",
  cursor: "grab",
  borderRadius: "$6",
  boxShadow: "1px 2px 10px rgba(0, 0, 0, 0.2)",
});

interface CardBoardProps {
  color: string;
  card: CardType;
  index: number;
  colId: string;
  isPreview: boolean;
  userId: string;
  boardId: string;
  socketId: string;
}

const CardBoard: React.FC<CardBoardProps> = ({
  card,
  index,
  color,
  isPreview,
  boardId,
  socketId,
  userId,
}) => {
  const isCardGroup = card.items.length > 1;
  const { updateCard } = useCards();
  const [editText, setEditText] = useState(false);
  const [newText, setNewText] = useState(card.text);

  const [show, setShow] = useState(false);
  const handleOpenSideBar = () => {
    if (!editText) setShow(true);
  };
  const handleUpdateCardText = () => {
    if (newText.trim() !== card.text) {
      if (newText?.length > 0 && boardId) {
        updateCard.mutate({
          boardId,
          cardItemId: card.items[0]._id,
          cardId: card._id,
          text: newText.trim(),
          socketId,
          isCardGroup,
        });
      } else {
        ToastMessage("Card text cannot be empty!", "error");
      }
    }
    setEditText(false);
  };

  return (
    <Draggable key={card._id} draggableId={card._id} index={index}>
      {(provided) => (
        <Container
          direction="column"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          onClick={handleOpenSideBar}
        >
          {!editText && !isPreview && card.createdBy === userId && (
            <Flex justify="end" gap="4">
              <EditItem editText={editText} setEditText={setEditText} />
              <DeleteItem
                itemId={card._id}
                type="CARD"
                socketId={socketId}
                boardId={boardId}
                cardId={card._id}
                cardItemId={card.items[0]._id}
              />
            </Flex>
          )}
          {!isPreview && (
            <TextItem
              editText={editText}
              newText={newText}
              setNewText={setNewText}
              text={card.text}
            />
          )}
          {!editText && !isPreview && (
            <CardFooter boardId={boardId} socketId={socketId} userId={userId} card={card} />
          )}
          {!isPreview && (
            <SideBard
              show={show}
              setShow={setShow}
              card={card}
              color={color}
              userId={userId}
              boardId={boardId}
              socketId={socketId}
            />
          )}
          {editText && <UpdateItem handleUpdate={handleUpdateCardText} />}
        </Container>
      )}
    </Draggable>
  );
};

export default CardBoard;
