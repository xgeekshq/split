import { CheckIcon } from "@modulz/radix-icons";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { styled } from "../../../stitches.config";
import Comment from "../Comment/Comment";
import ToastMessage from "../../../utils/toast";
import Flex from "../../Primitives/Flex";
import AddCommentDto from "../../../types/comment/addComment.dto";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import CardType from "../../../types/card/card";
import { getCommentsFromCardGroup } from "../../../helper/board/comments";
import Button from "../../Primitives/Button";
import useComments from "../../../hooks/useComments";

const SideBarContent = styled("div", {
  position: "sticky",
  top: 0,
  background: "White",
  borderTop: "2px solid black",
  borderBottom: "2px solid black",
  borderLeft: "2px solid black",
  width: "$400",
});

const StyledCheckIcon = styled(CheckIcon, { size: "$20" });

interface SideBarProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  color: string;
  card: CardType;
  userId: string;
  boardId: string;
  socketId: string;
}

const SideBard = React.memo<SideBarProps>(
  ({ show, setShow, card, color, userId, boardId, socketId }) => {
    const { addCommentInCard } = useComments();

    const cardItemId = card.items && card.items.length === 1 ? card.items[0]._id : undefined;
    const comments = cardItemId ? card.items[0].comments : getCommentsFromCardGroup(card);

    // setText is missing
    const [text] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setShow(false));

    const addComment = () => {
      if (boardId) {
        const changes: AddCommentDto = {
          boardId,
          cardItemId,
          cardId: card._id,
          socketId,
          isCardGroup: !cardItemId,
          text,
        };
        addCommentInCard.mutate(changes);
      }
    };

    const handleAddComment = () => {
      if (text?.length > 0) {
        addComment();
      } else {
        ToastMessage("Comment text cannot be empty!", "error");
      }
    };
    if (!show) return null;
    return createPortal(
      <SideBarContent ref={ref}>
        <Flex direction="column">
          {/* <ResizableTextArea value={text} editText={setText} border={false} edit={false} /> */}
          <Button css={{ borderTop: "1px solid black" }} color="green" onClick={handleAddComment}>
            <StyledCheckIcon />
          </Button>
          <Flex css={{ borderTop: "1px solid black", p: "$8" }} direction="column">
            {comments.length > 0 &&
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  color={color}
                  cardId={card._id}
                  cardItemId={cardItemId}
                  userId={userId}
                  boardId={boardId}
                  isNested={comment.isNested}
                  socketId={socketId}
                />
              ))}
          </Flex>
        </Flex>
      </SideBarContent>,
      document.getElementById("sidebar") ?? document.body
    );
  }
);

export default SideBard;
