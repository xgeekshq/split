import React from "react";
import Text from "../../Primitives/Text";
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from "../../Primitives/Popover";
import VerticalThreeDotsIcon from "../../icons/VerticalThreeDots";
import EditIcon from "../../icons/Edit";
import BinIcon from "../../icons/BinIcon";

interface PopoverSettingsContentProps {
  setEditCard: () => void;
  setDeleteCard?: () => void;
}

const PopoverCommentSettingsContent = ({
  setEditCard,
  setDeleteCard,
}: PopoverSettingsContentProps) => {
  return (
    <PopoverContent>
      <PopoverItem onClick={setEditCard} gap="8" align="center">
        <EditIcon dropdown />
        <Text size="sm" weight="medium">
          Edit comment
        </Text>
      </PopoverItem>
      <PopoverItem gap="8" align="center" onClick={setDeleteCard}>
        <BinIcon />
        <Text size="sm" weight="medium">
          Delete comment
        </Text>
      </PopoverItem>
    </PopoverContent>
  );
};

interface PopoverSettingsProps {
  handleEditing: () => void;
  handleDeleteComment?: () => void;
}

const PopoverCommentSettings = React.memo(
  ({ handleEditing, handleDeleteComment }: PopoverSettingsProps) => {
    return (
      <Popover>
        <PopoverTrigger css={{ position: "relative" }}>
          <VerticalThreeDotsIcon />
        </PopoverTrigger>
        <PopoverCommentSettingsContent
          setEditCard={handleEditing}
          setDeleteCard={handleDeleteComment}
        />
      </Popover>
    );
  }
);

export default PopoverCommentSettings;
