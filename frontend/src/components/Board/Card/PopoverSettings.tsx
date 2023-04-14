import React, { useState } from 'react';

import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';
import useCards from '@/hooks/useCards';
import { CardItemType } from '@/types/card/cardItem';

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
          <Text fontWeight="medium" size="sm">
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
          <Text fontWeight="medium" size="sm">
            Unmerge card
          </Text>
        </PopoverItem>
      )}
      {isOwner && (
        <ConfirmationDialog
          confirmationHandler={setDeleteCard}
          confirmationLabel="Delete"
          description="Do you really want to delete this card?"
          title="Delete card"
          variant="danger"
        >
          <PopoverItem>
            <Icon name="trash-alt" />
            <Text fontWeight="medium" size="sm">
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
      <Popover onOpenChange={handleOpenPopover} open={openPopover}>
        <PopoverTrigger
          disabled={hideCards && item.createdBy?._id !== userId && isItem}
          size="sm"
          variant="dark"
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
