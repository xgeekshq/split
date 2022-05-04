import React, { useState } from "react";
import { CardItemType } from "../../../../types/card/cardItem";
import Flex from "../../../Primitives/Flex";
import { styled } from "../../../../stitches.config";
import Text from "../../../Primitives/Text";
import CardFooter from "../CardFooter";
import PopoverCardSettings from "../PopoverSettings";
import AddCard from "../AddCard";
import DeleteCard from "../DeleteCard";
import VerticalThreeDotsIcon from "../../../icons/VerticalThreeDots";

interface CardItemProps {
  item: CardItemType;
  color: string;
  teamName?: string;
  lastOne?: boolean;
  firstOne: boolean;
  columnId: string;
  boardId: string;
  cardGroupId: string;
  socketId: string;
  cardGroupPosition: number;
  anonymous: boolean;
  userId: string;
  isMainboard: boolean;
  isSubmited: boolean;
}

const Container = styled(Flex, {
  py: "$12",
  wordBreak: "breakWord",
});

const CardItem = React.memo(
  ({
    item,
    color,
    teamName,
    firstOne,
    lastOne,
    columnId,
    boardId,
    cardGroupId,
    socketId,
    cardGroupPosition,
    anonymous,
    userId,
    isMainboard,
    isSubmited,
  }: CardItemProps) => {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleting = () => {
      setDeleting(!deleting);
    };

    const handleEditing = () => {
      setEditing(!editing);
    };
    return (
      <Container gap="10" direction="column" css={{ backgroundColor: color }} justify="between">
        {!editing && (
          <Flex direction="column">
            <Flex justify="between" css={{ "& > div": { zIndex: 2 } }}>
              <Text size="sm">{item.text}</Text>
              {isSubmited && (
                <Flex css={{ position: "relative", top: firstOne ? "-35px" : 0 }}>
                  <VerticalThreeDotsIcon />
                </Flex>
              )}
              {!isSubmited && (
                <PopoverCardSettings
                  firstOne={firstOne}
                  columnId={columnId}
                  boardId={boardId}
                  cardGroupId={cardGroupId}
                  socketId={socketId}
                  itemId={item._id}
                  newPosition={cardGroupPosition}
                  isItem
                  handleEditing={handleEditing}
                  handleDeleteCard={handleDeleting}
                />
              )}
            </Flex>

            {!lastOne && (
              <CardFooter
                card={item}
                teamName={teamName}
                isItem
                boardId={boardId}
                socketId={socketId}
                userId={userId}
                anonymous={anonymous}
                isMainboard={isMainboard}
              />
            )}
          </Flex>
        )}
        {editing && !isSubmited && (
          <AddCard
            isCard
            isUpdate
            colId={columnId}
            boardId={boardId}
            socketId={socketId}
            cardId={cardGroupId}
            cardItemId={item._id}
            cardText={item.text}
            cancelUpdate={handleEditing}
          />
        )}
        {deleting && (
          <DeleteCard
            boardId={boardId}
            cardId={cardGroupId}
            socketId={socketId}
            cardItemId={item._id}
            handleClose={handleDeleting}
          />
        )}
      </Container>
    );
  }
);

export default CardItem;
