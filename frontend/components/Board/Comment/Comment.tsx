import React, { useState } from "react";
import useBoard from "../../../hooks/useBoard";
import { styled } from "../../../stitches.config";
import CardComment from "../../../types/comment/comment";
import ToastMessage from "../../../utils/toast";
import Card from "../../Primitives/Card";
import Flex from "../../Primitives/Flex";
import DeleteItem from "../Item/DeleteItem";
import EditItem from "../Item/EditItem";
import TextItem from "../Item/TextItem";
import UpdateItem from "../Item/UpdateItem";

const Container = styled(Card, {
  borderRadius: "$2",
  mt: "$8",
});

interface CommentProps {
  comment: CardComment;
  color: string;
  cardId: string;
  cardItemId?: string;
  userId: string;
  boardId: string;
  socketId: string;
  isNested?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  color,
  cardId,
  cardItemId,
  userId,
  boardId,
  isNested,
  socketId,
}) => {
  Comment.defaultProps = { cardItemId: undefined, isNested: false };
  const [editText, setEditText] = useState(false);
  const [newText, setNewText] = useState(comment.text);

  const { updateComment } = useBoard({ autoFetchBoard: false, autoFetchBoards: false });

  const handleUpdateCommentText = () => {
    if (newText?.length > 0 && boardId) {
      updateComment.mutate({
        boardId,
        cardItemId,
        commentId: comment._id,
        cardId,
        text: newText,
        socketId,
        isCardGroup: cardItemId === undefined,
      });
    } else {
      ToastMessage("Comment text cannot be empty!", "error");
    }
    setEditText(false);
  };
  if (!cardId) return null;
  return (
    <Container
      css={{
        backgroundColor: editText ? "White" : color,
        border: editText ? `5px solid ${color}` : "none",
        borderRadius: "$6",
        boxShadow: "1px 2px 10px rgba(0, 0, 0, 0.2)",
        padding: !editText ? "$8" : "0",
      }}
      direction="column"
    >
      {!editText && !isNested && comment.createdBy === userId && (
        <Flex justify="end" gap="4">
          <EditItem editText={editText} setEditText={setEditText} />
          {!!comment._id && (
            <DeleteItem
              itemId={comment._id}
              type="COMMENT"
              socketId={socketId}
              boardId={boardId}
              cardId={cardId}
              cardItemId={cardItemId}
            />
          )}
        </Flex>
      )}
      <TextItem editText={editText} newText={newText} setNewText={setNewText} text={comment.text} />
      {editText && <UpdateItem handleUpdate={handleUpdateCommentText} />}
    </Container>
  );
};
export default Comment;
