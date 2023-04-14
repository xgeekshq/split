import React, { useState } from 'react';

import AddCardOrComment from '@/components/Board/AddCardOrComment';
import Comment from '@/components/Board/Comment/Comment';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { CardItemType } from '@/types/card/cardItem';
import CommentType from '@/types/comment/comment';
import { BoardPhases } from '@/utils/enums/board.phases';

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
  phase?: string;
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
    phase,
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
              columnId={columnId}
              comment={comment}
              hasAdminRole={hasAdminRole}
              hideCards={hideCards}
              isDefaultText={isDefaultText}
              isMainboard={isMainboard}
              isSubmited={isSubmited}
              phase={phase}
              postAnonymously={postAnonymously}
              socketId={socketId}
              userId={userId}
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
              anonymous={undefined}
              boardId={boardId}
              cancelUpdate={handleSetCreateComment}
              cardId={cardId}
              cardItemId={cardItems.length === 1 ? cardItems[0]._id : undefined}
              colId={columnId}
              isCard={false}
              isDefaultText={isDefaultText}
              isUpdate={false}
              postAnonymously={postAnonymously}
              socketId={socketId}
            />
          </Flex>
        )}
        {phase !== BoardPhases.SUBMITTED &&
          !isCreateCommentOpened &&
          !isSubmited &&
          (!isMainboard || hasAdminRole) && (
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
