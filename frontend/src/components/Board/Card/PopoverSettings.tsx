import React, { useState } from 'react';

import Icon from '@/components/Primitives/Icon';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popover';
import Text from '@/components/Primitives/Text';
import useCards from '@/hooks/useCards';
import { CardItemType } from '@/types/card/cardItem';

interface PopoverSettingsContentProps {
  isItem: boolean;
  isOwner: boolean;
  unmergeCard: () => void;
  setEditCard: () => void;
  setDeleteCard?: () => void;
}

const PopoverSettingsContent: React.FC<PopoverSettingsContentProps> = ({
  isItem,
  isOwner,
  unmergeCard,
  setEditCard,
  setDeleteCard,
}) => {
  const [unmergeClickLock, setUnmergeClickLock] = useState(true);

  PopoverSettingsContent.defaultProps = {
    setDeleteCard: undefined,
  };

  return (
    <PopoverContent>
      {isOwner && (
        <PopoverItem onClick={setEditCard}>
          <Icon name="edit" />
          <Text size="sm" fontWeight="medium">
            Edit
          </Text>
        </PopoverItem>
      )}
      {isItem && (
        <PopoverItem
          onClick={
            unmergeClickLock
              ? () => {
                  unmergeCard();
                  setUnmergeClickLock(false);
                }
              : () => null
          }
        >
          <Icon name="arrow-long-right" />
          <Text size="sm" fontWeight="medium">
            Unmerge card
          </Text>
        </PopoverItem>
      )}
      {isOwner && (
        <PopoverItem onClick={setDeleteCard}>
          <Icon name="trash-alt" />
          <Text size="sm" fontWeight="medium">
            Delete card
          </Text>
        </PopoverItem>
      )}
    </PopoverContent>
  );
};

interface PopoverSettingsProps {
  firstOne: boolean;
  isItem: boolean;
  columnId: string;
  boardId: string;
  cardGroupId?: string;
  socketId: string;
  itemId: string;
  newPosition: number;
  hideCards: boolean;
  userId: string;
  item: CardItemType;
  hasAdminRole: boolean;
  handleEditing: () => void;
  handleDeleteCard?: () => void;
}

const PopoverCardSettings: React.FC<PopoverSettingsProps> = React.memo(
  ({
    firstOne,
    itemId,
    columnId,
    boardId,
    cardGroupId,
    socketId,
    newPosition,
    isItem,
    handleEditing,
    handleDeleteCard,
    item,
    userId,
    hideCards,
    hasAdminRole,
  }) => {
    const [openPopover, setOpenPopover] = useState(false);

    const { removeFromMergeCard } = useCards();

    const unmergeCard = () => {
      if (!cardGroupId) return;
      removeFromMergeCard.mutate({
        boardId,
        cardGroupId,
        columnId,
        socketId,
        cardId: itemId,
        newPosition: firstOne ? newPosition : newPosition + 1,
      });
    };

    const handleOpenPopover = (value: boolean) => setOpenPopover(value);

    const handleDelete = () => {
      setOpenPopover(false);
      if (handleDeleteCard) handleDeleteCard();
    };

    return (
      <Popover open={openPopover} onOpenChange={handleOpenPopover}>
        <PopoverTrigger
          variant="dark"
          size="sm"
          disabled={hideCards && item.createdBy?._id !== userId}
          css={{
            top: firstOne ? '-35px' : 0,
          }}
        >
          <Icon name="menu-dots" />
        </PopoverTrigger>

        <PopoverSettingsContent
          isItem={isItem}
          isOwner={item.createdBy?._id === userId || hasAdminRole}
          setDeleteCard={handleDelete}
          setEditCard={handleEditing}
          unmergeCard={unmergeCard}
        />
      </Popover>
    );
  },
);

export default PopoverCardSettings;
