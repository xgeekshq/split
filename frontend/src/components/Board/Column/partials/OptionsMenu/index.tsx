import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Flex';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverItem,
} from '@/components/Primitives/Popover';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import useColumn from '@/hooks/useColumn';
import CardType from '@/types/card/card';
import { useState } from 'react';
import ConfirmationDialog from '@/components/Primitives/ConfirmationDialog';
import ColorSquare from '../ColorSquare';
import { SwitchDefaultText } from '../SwitchDefaultText';

type OptionsMenuProps = {
  disabled?: boolean;
  cards: CardType[];
  title: string;
  columnId: string;
  color: string;
  boardId: string;
  cardText?: string;
  setOpenDialogName: (open: boolean, type: string) => void;
  handleDialogChange: (openName: boolean, openDeleteColumn: boolean) => void;
  isDefaultText?: boolean;
  socketId: string;
};

export const colors = [
  '$highlight1Light',
  '$highlight2Light',
  '$highlight3Light',
  '$highlight4Light',
  '$infoLighter',
  '$warningLighter',
];

const OptionsMenu = ({
  disabled,
  cards,
  title,
  columnId,
  color,
  cardText,
  boardId,
  isDefaultText,
  socketId,
  setOpenDialogName,
  handleDialogChange,
}: OptionsMenuProps) => {
  const [openPopover, setOpenPopover] = useState(false);

  // Update Board Hook
  const {
    updateColumn: { mutate: mutateColumn },
    deleteCardsFromColumn: { mutate: mutateBoard },
  } = useColumn();

  const handleDefaultTextCheck = () => {
    const column = {
      _id: columnId,
      title,
      color,
      cards,
      cardText,
      boardId,
      isDefaultText: !isDefaultText,
      socketId,
    };

    mutateColumn(column);
  };

  const handleColorChange = (selectedColor: string) => {
    const column = {
      _id: columnId,
      title,
      color: selectedColor,
      cards,
      cardText,
      boardId,
      isDefaultText,
      socketId,
    };

    mutateColumn(column);
  };

  const handleOpen = (type: string) => {
    setOpenDialogName(true, type);
    setOpenPopover(false);
  };

  const handleOpenPopover = (value: boolean) => setOpenPopover(value);

  const handleEmptyColumn = () => {
    setOpenPopover(false);
    mutateBoard({
      id: columnId,
      boardId,
      socketId,
    });
  };

  return (
    <>
      <Popover open={openPopover} onOpenChange={handleOpenPopover}>
        <PopoverTrigger variant="light" size="md" disabled={disabled} css={{ ml: '$8' }}>
          <Icon name="menu-dots" />
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent>
            <PopoverItem onClick={() => handleOpen('ColumnName')}>
              <Icon name="boards" />
              <Text size="sm">Edit column name </Text>
            </PopoverItem>
            <ConfirmationDialog
              title="Empty column of all cards"
              description="Do you really want to remove all cards from this column?"
              confirmationLabel="Empty Column"
              variant="danger"
              confirmationHandler={handleEmptyColumn}
            >
              <PopoverItem>
                <Icon name="recurring" />
                <Text size="sm">Empty column cards</Text>
              </PopoverItem>
            </ConfirmationDialog>
            <PopoverItem>
              <Icon name="file-alt" />
              <Text onClick={() => handleOpen('CardText')} size="sm">
                Activate card default text
              </Text>

              <SwitchDefaultText
                handleCheckedChange={handleDefaultTextCheck}
                isChecked={!isDefaultText}
                disabled={cardText === 'Write your comment here...'}
              />
            </PopoverItem>
            <PopoverItem onClick={() => handleDialogChange(false, true)}>
              <Icon name="trash-alt" />
              <Text size="sm">Delete column</Text>
            </PopoverItem>
            <Separator css={{ mt: '$5' }} />
            <Flex gap={8} css={{ pb: '$8', pt: '$20', pl: '$18' }}>
              <Text size="xs" color="primary800" fontWeight="medium">
                Cards color
              </Text>
            </Flex>
            <Flex direction="row" align="center" css={{ pb: '$10', pl: '$3' }}>
              {colors.map((square) => (
                <ColorSquare key={square} color={square} handleColorChange={handleColorChange} />
              ))}
            </Flex>
          </PopoverContent>
        )}
      </Popover>
    </>
  );
};

export default OptionsMenu;
