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

const PopoverCommentSettingsContent: React.FC<PopoverSettingsContentProps> = ({
  setEditCard,
  setDeleteCard,
}) => {
  PopoverCommentSettingsContent.defaultProps = {
    setDeleteCard: undefined,
  };

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

const PopoverCommentSettings: React.FC<PopoverSettingsProps> = React.memo(
  ({ handleEditing, handleDeleteComment }) => {
    PopoverCommentSettings.defaultProps = {
      handleDeleteComment: undefined,
    };
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
