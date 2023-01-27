import React, { useState } from 'react';

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { commentBlur } from '@/helper/board/blurFilter';
import useComments from '@/hooks/useComments';
import CommentType from '@/types/comment/comment';
import DeleteCommentDto from '@/types/comment/deleteComment.dto';
import AddCardOrComment from '../AddCardOrComment';
import PopoverCommentSettings from './PopoverSettings';

interface CommentProps {
  comment: CommentType;
  cardId: string;
  cardItemId?: string;
  boardId: string;
  socketId: string;
  isSubmited: boolean;
  hideCards: boolean;
  userId: string;
  columnId: string;
  isDefaultText: boolean;
}

const Comment: React.FC<CommentProps> = React.memo(
  ({
    comment,
    cardId,
    cardItemId,
    boardId,
    socketId,
    isSubmited,
    hideCards,
    userId,
    columnId,
    isDefaultText,
  }) => {
    const { deleteComment } = useComments();
    const [editing, setEditing] = useState(false);

    const handleDeleteComment = () => {
      const deleteCommentDto: DeleteCommentDto = {
        boardId,
        cardItemId,
        commentId: comment._id,
        cardId,
        socketId,
        isCardGroup: !cardItemId,
      };

      deleteComment.mutate(deleteCommentDto);
    };

    const handleEditing = () => {
      setEditing(!editing);
    };

    return (
      <Flex
        direction="column"
        css={{
          border: '1px solid $colors$primaryBase',
          width: '100%',
          borderRadius: '16px 16px 0px 16px',
          p: '$12',
        }}
      >
        {!editing && (
          <Flex direction="column">
            <Flex css={{ width: '100%' }} justify="between">
              <Text
                size="xs"
                css={{
                  filter: commentBlur(hideCards, comment, userId),
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                }}
              >
                {comment.text}
              </Text>
              {isSubmited && userId === comment.createdBy._id && (
                <Icon
                  name="menu-dots"
                  css={{
                    width: '$20',
                    height: '$20',
                  }}
                />
              )}
              {!isSubmited && userId === comment.createdBy._id && (
                <PopoverCommentSettings
                  handleDeleteComment={handleDeleteComment}
                  handleEditing={handleEditing}
                />
              )}
            </Flex>
            <Flex align="center" css={{ minHeight: '$24' }}>
              {!comment.anonymous && (
                <Text
                  size="xs"
                  fontWeight="medium"
                  css={{
                    filter: commentBlur(hideCards, comment, userId),
                  }}
                >
                  {comment.createdBy.firstName} {comment.createdBy.lastName}
                </Text>
              )}
            </Flex>
          </Flex>
        )}
        {editing && (
          <AddCardOrComment
            isEditing
            isUpdate
            boardId={boardId}
            cancelUpdate={handleEditing}
            cardId={cardId}
            cardItemId={cardItemId}
            cardText={comment.text}
            colId={columnId}
            commentId={comment._id}
            isCard={false}
            socketId={socketId}
            anonymous={comment.anonymous}
            isDefaultText={isDefaultText}
          />
        )}
      </Flex>
    );
  },
);

export default Comment;
