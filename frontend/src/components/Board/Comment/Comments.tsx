import React, { useState } from 'react';

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { CardItemType } from '@/types/card/cardItem';
import CommentType from '@/types/comment/comment';
import AddCardOrComment from '../AddCardOrComment';
import Comment from './Comment';

interface CommentsListProps {
  comments: CommentType[];
  cardId: string;
  cardItems: CardItemType[];
  boardId: string;
  socketId: string;
  isSubmited: boolean;
  hideCards: boolean;
  userId: string;
  columnId: string;
  isDefaultText: boolean;
  hasAdminRole: boolean;
  isMainboard: boolean;
  postAnonymously: boolean;
}

const Comments = React.memo(
  ({
    comments,
    cardId,
    cardItems,
    boardId,
    socketId,
    isSubmited,
    hideCards,
    userId,
    columnId,
    isDefaultText,
    hasAdminRole,
    isMainboard,
    postAnonymously,
  }: CommentsListProps) => {
    const [isCreateCommentOpened, setCreateComment] = useState(false);

    const handleSetCreateComment = () => {
      if (!isSubmited) setCreateComment(!isCreateCommentOpened);
    };

    return (
      <Flex align="center" css={{ width: '100%', pb: '$16' }} direction="column">
        <Flex align="center" css={{ width: '100%', mb: '$12' }} gap="4">
          <Separator css={{ backgroundColor: 'black' }} orientation="horizontal" size="sm" />
          <Text size="xxs">Comments</Text>
          <Separator css={{ backgroundColor: 'black' }} />
        </Flex>
        <Flex css={{ px: '$16', mb: '$12', width: '100%' }} direction="column" gap="8">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              boardId={boardId}
              cardId={cardId}
              comment={comment}
              hideCards={hideCards}
              isSubmited={isSubmited}
              socketId={socketId}
              userId={userId}
              columnId={columnId}
              isDefaultText={isDefaultText}
              hasAdminRole={hasAdminRole}
              isMainboard={isMainboard}
              postAnonymously={postAnonymously}
              cardItemId={
                cardItems.find((item) => {
                  if (item && item.comments)
                    return item.comments.find((commentFound) => commentFound._id === comment._id);
                  return null;
                })?._id
              }
            />
          ))}
        </Flex>
        {isCreateCommentOpened && !isSubmited && (
          <Flex css={{ width: '100%', px: '$16' }}>
            <AddCardOrComment
              isEditing
              boardId={boardId}
              cancelUpdate={handleSetCreateComment}
              cardId={cardId}
              cardItemId={cardItems.length === 1 ? cardItems[0]._id : undefined}
              colId={columnId}
              isCard={false}
              isUpdate={false}
              socketId={socketId}
              anonymous={undefined}
              isDefaultText={isDefaultText}
              postAnonymously={postAnonymously}
            />
          </Flex>
        )}
        {!isCreateCommentOpened && !isSubmited && (!isMainboard || hasAdminRole) && (
          <Flex
            css={{ '@hover': { '&:hover': { cursor: 'pointer' } } }}
            onClick={handleSetCreateComment}
          >
            <Icon css={{ color: '$primary400', width: '$16', height: '$16' }} name="plus" />
          </Flex>
        )}
      </Flex>
    );
  },
);

export default Comments;
