import React from "react";
import Text from "../../Primitives/Text";
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from "../../Primitives/Popover";
import VerticalThreeDotsIcon from "../../icons/VerticalThreeDots";
import useCards from "../../../hooks/useCards";
import EditIcon from "../../icons/Edit";
import BinIcon from "../../icons/BinIcon";
import ArrowLongRight from "../../icons/ArrowLongRight";

interface PopoverSettingsContentProps {
  isItem: boolean;
  unmergeCard: () => void;
  setEditCard: () => void;
  setDeleteCard?: () => void;
}

const PopoverSettingsContent: React.FC<PopoverSettingsContentProps> = ({
  isItem,
  unmergeCard,
  setEditCard,
  setDeleteCard,
}) => {
  PopoverSettingsContent.defaultProps = {
    setDeleteCard: undefined,
  };

  return (
    <PopoverContent portalled={false}>
      <PopoverItem onClick={setEditCard} gap="8" align="center">
        <EditIcon dropdown />
        <Text size="sm" weight="medium">
          Edit
        </Text>
      </PopoverItem>
      {isItem && (
        <PopoverItem onClick={unmergeCard} gap="8" align="center">
          <ArrowLongRight />
          <Text size="sm" weight="medium">
            Unmerge card
          </Text>
        </PopoverItem>
      )}
      <PopoverItem gap="8" align="center" onClick={setDeleteCard}>
        <BinIcon />
        <Text size="sm" weight="medium">
          Delete card
        </Text>
      </PopoverItem>
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
  }) => {
    const { removeFromMergeCard } = useCards();

    const unmergeCard = () => {
      if (!cardGroupId) return;
      removeFromMergeCard.mutate({
        boardId,
        cardGroupId,
        columnId,
        socketId,
        cardId: itemId,
        newPosition,
      });
    };

    return (
      <Popover>
        <PopoverTrigger css={{ position: "relative", top: firstOne ? "-35px" : 0 }}>
          <VerticalThreeDotsIcon />
        </PopoverTrigger>
        <PopoverSettingsContent
          isItem={isItem}
          unmergeCard={unmergeCard}
          setEditCard={handleEditing}
          setDeleteCard={handleDeleteCard}
        />
      </Popover>
    );
  }
);

export default PopoverCardSettings;
