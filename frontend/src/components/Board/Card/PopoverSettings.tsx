import React, { useState } from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popover';
import Text from '@/components/Primitives/Text';
import useCards from '@/hooks/useCards';
import { CardItemType } from '@/types/card/cardItem';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';

interface PopoverSettingsContentProps {
  isItem: boolean;
  isOwner: boolean;
  unmergeCard: () => void;
  setEditCard: () => void;
  setDeleteCard: () => void;
}

const PopoverSettingsContent = ({
  isItem,
  isOwner,
  unmergeCard,
  setEditCard,
  setDeleteCard,
}: PopoverSettingsContentProps) => {
  const [unmergeClickLock, setUnmergeClickLock] = useState(true);

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
        <ConfirmationDialog
          title="Delete card"
          description="Do you really want to delete this card?"
          confirmationLabel="Delete"
          variant="danger"
          confirmationHandler={setDeleteCard}
        >
          <PopoverItem>
            <Icon name="trash-alt" />
            <Text size="sm" fontWeight="medium">
              Delete card
            </Text>
          </PopoverItem>
        </ConfirmationDialog>
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
  handleDelete: () => void;
  handleEditing: () => void;
}

const PopoverCardSettings = React.memo(
  ({
    firstOne,
    itemId,
    columnId,
    boardId,
    cardGroupId,
    socketId,
    newPosition,
    isItem,
    handleDelete,
    handleEditing,
    item,
    userId,
    hideCards,
    hasAdminRole,
  }: PopoverSettingsProps) => {
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

    const handleDeleteCard = () => {
      setOpenPopover(false);
      handleDelete();
    };

    return (
      <Popover open={openPopover} onOpenChange={handleOpenPopover}>
        <PopoverTrigger
          variant="dark"
          size="sm"
          disabled={hideCards && item.createdBy?._id !== userId && isItem}
          css={{
            top: firstOne ? '-35px' : 0,
          }}
        >
          <Icon name="menu-dots" />
        </PopoverTrigger>

        <PopoverSettingsContent
          isItem={isItem}
          isOwner={item.createdBy?._id === userId || hasAdminRole}
          setDeleteCard={handleDeleteCard}
          setEditCard={handleEditing}
          unmergeCard={unmergeCard}
        />
      </Popover>
    );
  },
);

export default PopoverCardSettings;
