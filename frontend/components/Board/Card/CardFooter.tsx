import React from "react";
import { ChatBubbleIcon } from "@modulz/radix-icons";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import { styled } from "../../../stitches.config";
import CardType from "../../../types/card/card";
import { getCommentsFromCardGroup } from "../../../helper/board/comments";
import Button from "../../Primitives/Button";

const StyledChatBubbleIcon = styled(ChatBubbleIcon, { size: "100%" });

interface FooterProps {
  boardId: string;
  userId: string;
  socketId: string | undefined;
  card: CardType;
}

const CardFooter = React.memo<FooterProps>(({ card }) => {
  const comments =
    card.items.length === 1 ? card.items[0].comments : getCommentsFromCardGroup(card);

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
    </Flex>
  );
});

export default CardFooter;
