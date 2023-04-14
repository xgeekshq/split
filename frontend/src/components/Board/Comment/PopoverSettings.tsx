import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';

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
      <PopoverItem onClick={setEditCard}>
        <Icon name="edit" />
        <Text fontWeight="medium" size="sm">
          Edit comment
        </Text>
      </PopoverItem>
      <PopoverItem onClick={setDeleteCard}>
        <Icon name="trash-alt" />
        <Text fontWeight="medium" size="sm">
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
        <PopoverTrigger size="sm" variant="dark">
          <Icon css={{ width: '$20', height: '$20' }} name="menu-dots" />
        </PopoverTrigger>
        <PopoverCommentSettingsContent
          setDeleteCard={handleDeleteComment}
          setEditCard={handleEditing}
        />
      </Popover>
    );
  },
);

export default PopoverCommentSettings;
