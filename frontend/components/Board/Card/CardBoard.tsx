import React, { useMemo, useState } from "react";
import { Draggable } from "@react-forked/dnd";
import { styled } from "../../../stitches.config";
import CardType from "../../../types/card/card";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import CardFooter from "./CardFooter";
import CardItemList from "./CardItem/CardItemList";
import MergedIcon from "../../icons/Merged";
import Comments from "../Comment/Comments";
import { getCommentsFromCardGroup } from "../../../helper/board/comments";
import PopoverCardSettings from "./PopoverSettings";
import AddCard from "./AddCard";
import DeleteCard from "./DeleteCard";
import { BoardUser } from "../../../types/board/board.user";
import VerticalThreeDotsIcon from "../../icons/VerticalThreeDots";

const Container = styled(Flex, {
  borderRadius: "$8",
  p: "$16",
  wordBreak: "breakWord",
});

interface CardBoardProps {
  color: string;
  card: CardType;
  index: number;
  colId: string;
  userId: string;
  boardId: string;
  socketId: string;
  anonymous: boolean;
  isMainboard: boolean;
  boardUser?: BoardUser;
  maxVotes?: number;
  isSubmited: boolean;
}

const CardBoard = React.memo<CardBoardProps>(
  ({
    card,
    index,
    color,
    boardId,
    socketId,
    userId,
    colId,
    anonymous,
    isMainboard,
    boardUser,
    maxVotes,
    isSubmited,
  }) => {
    const isCardGroup = card.items.length > 1;
    const comments = useMemo(() => {
      return card.items.length === 1 ? card.items[0].comments : getCommentsFromCardGroup(card);
    }, [card]);

    const [isCommentsOpened, setOpenComments] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleOpenComments = () => {
      setOpenComments(!isCommentsOpened);
    };

    const handleEditing = () => {
      setEditing(!editing);
    };

    const handleDeleting = () => {
      setDeleting(!deleting);
    };
    return (
      <Draggable key={card._id} draggableId={card._id} index={index} isDragDisabled={isSubmited}>
        {(provided) => (
          <Flex
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            direction="column"
            css={{
              backgroundColor: color,
              borderRadius: "$8",
              mb: "$12",
            }}
          >
            <Container
              direction="column"
              css={{
                cursor: "grab",
                backgroundColor: color,
                py: !isCardGroup ? "$16" : "$8",
                mb: isCardGroup ? "$12" : "none",
              }}
            >
              {editing && !isSubmited && (
                <AddCard
                  isCard
                  isUpdate
                  colId={colId}
                  boardId={boardId}
                  socketId={socketId}
                  cardId={card._id}
                  cardItemId={card.items[0]._id}
                  cardText={card.text}
                  cancelUpdate={handleEditing}
                />
              )}
              {!editing && (
                <Flex direction="column">
                  {isCardGroup && (
                    <Flex justify="between" css={{ py: "$8" }}>
                      <Flex gap="4" align="center">
                        <MergedIcon />
                        <Text size="xxs" weight="medium">
                          {card.items.length} merged cards
                        </Text>
                      </Flex>
                    </Flex>
                  )}
                  {!isCardGroup && (
                    <Flex justify="between" css={{ mb: "$8", "& > div": { zIndex: 2 } }}>
                      <Text size="md" css={{ wordBreak: "break-word" }}>
                        {card.text}
                      </Text>
                      {isSubmited && <VerticalThreeDotsIcon />}
                      {!isSubmited && (
                        <PopoverCardSettings
                          firstOne={false}
                          isItem={false}
                          columnId={colId}
                          boardId={boardId}
                          socketId={socketId}
                          cardGroupId={card._id}
                          itemId={card.items[0]._id}
                          newPosition={0}
                          handleEditing={handleEditing}
                          handleDeleteCard={handleDeleting}
                        />
                      )}
                    </Flex>
                  )}
                  {card.items && card.items.length > 1 && (
                    <CardItemList
                      items={card.items}
                      color={color}
                      submitedByTeam={card.createdByTeam}
                      columnId={colId}
                      boardId={boardId}
                      cardGroupId={card._id}
                      socketId={socketId}
                      cardGroupPosition={index}
                      anonymous={anonymous}
                      userId={userId}
                      isMainboard={isMainboard}
                      isSubmited={isSubmited}
                    />
                  )}
                  <CardFooter
                    boardId={boardId}
                    socketId={socketId}
                    userId={userId}
                    anonymous={anonymous}
                    card={card}
                    teamName={card.createdByTeam?.name}
                    isItem={false}
                    isMainboard={isMainboard}
                    comments={comments}
                    setOpenComments={handleOpenComments}
                    isCommentsOpened={isCommentsOpened}
                    boardUser={boardUser}
                    maxVotes={maxVotes}
                  />
                </Flex>
              )}
              {deleting && (
                <DeleteCard
                  boardId={boardId}
                  cardId={card._id}
                  socketId={socketId}
                  handleClose={handleDeleting}
                />
              )}
            </Container>
            {isCommentsOpened && (
              <Comments
                comments={comments}
                cardId={card._id}
                boardId={boardId}
                socketId={socketId}
                cardItems={card.items}
                isSubmited={isSubmited}
              />
            )}
          </Flex>
        )}
      </Draggable>
    );
  }
);

export default CardBoard;
