import React from "react";
import {
  ChatBubbleIcon,
  ThickArrowUpIcon,
  PlusCircledIcon,
  MinusCircledIcon,
} from "@modulz/radix-icons";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import { styled } from "../../../stitches.config";
import CardType from "../../../types/card/card";
import { getCommentsFromCardGroup } from "../../../helper/board/comments";
import Button from "../../Primitives/Button";
import { getCardVotes } from "../../../helper/board/votes";
import ToastMessage from "../../../utils/toast";
import isEmpty from "../../../utils/isEmpty";
import useVotes from "../../../hooks/useVotes";

const StyledChatBubbleIcon = styled(ChatBubbleIcon, { size: "100%" });
const StyledPlusIcon = styled(PlusCircledIcon, { size: "100%" });
const StyledMinusIcon = styled(MinusCircledIcon, { size: "100%" });
const StyledCThickArrowUpIcon = styled(ThickArrowUpIcon, { size: "100%" });

interface FooterProps {
  boardId: string;
  userId: string;
  socketId: string | undefined;
  card: CardType;
}

const CardFooter = React.memo<FooterProps>(({ boardId, userId, socketId, card }) => {
  const { addVote, deleteVote } = useVotes();

  const actualBoardVotes = 0;

  const cardItemId = card.items.length === 1 ? card.items[0]._id : undefined;

  const votesInThisCard = card.items.length === 1 ? card.items[0].votes : getCardVotes(card);

  const votesOfUserInThisCard = votesInThisCard.filter((vote) => vote === userId).length;

  const comments =
    card.items.length === 1 ? card.items[0].comments : getCommentsFromCardGroup(card);

  const maxVotes = 6;

  const handleDeleteVote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (isEmpty(votesOfUserInThisCard)) return;
    ToastMessage(`You have ${maxVotes - actualBoardVotes + 1} remaining`, "info");
    deleteVote.mutate({
      boardId,
      cardId: card._id,
      socketId,
      cardItemId,
      isCardGroup: !cardItemId,
    });
  };

  const handleAddVote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (actualBoardVotes >= maxVotes) return;
    ToastMessage(`You have ${maxVotes - actualBoardVotes - 1} remaining`, "info");
    addVote.mutate({
      boardId,
      cardId: card._id,
      socketId,
      cardItemId,
      isCardGroup: !cardItemId,
    });
  };

  return (
    <Flex align="center" justify="end" css={{ mt: "auto" }} gap="6">
      <Button
        css={{
          mr: "$4",
          size: "$20",
          cursor: "grab",
        }}
      >
        <StyledChatBubbleIcon />
      </Button>
      <Text>{comments.length}</Text>
      <Button
        css={{
          size: "$20",
          cursor: "grab",
        }}
      >
        <StyledCThickArrowUpIcon />
      </Button>

      <Text>{votesInThisCard.length}</Text>

      <Button
        css={{ size: "$20" }}
        onClick={handleAddVote}
        // disabled={actualBoardVotes === maxVotes}
      >
        <StyledPlusIcon />
      </Button>

      {!isEmpty(votesOfUserInThisCard) && (
        <>
          <Text>{votesOfUserInThisCard}</Text>
          <Button
            css={{ size: "$20" }}
            onClick={handleDeleteVote}
            disabled={isEmpty(actualBoardVotes)}
          >
            <StyledMinusIcon />
          </Button>
        </>
      )}
    </Flex>
  );
});

export default CardFooter;
