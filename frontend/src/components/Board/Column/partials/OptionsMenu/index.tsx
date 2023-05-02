import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import ColorSquare from '@/components/Board/Column/partials/ColorSquare';
import { SwitchDefaultText } from '@/components/Board/Column/partials/SwitchDefaultText';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import useBoard from '@/hooks/useBoard';
import useColumn from '@/hooks/useColumn';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { UpdateBoardType } from '@/types/board/board';
import CardType from '@/types/card/card';

type OptionsMenuProps = {
  disabled?: boolean;
  cards: CardType[];
  title: string;
  columnId: string;
  color: string;
  boardId: string;
  cardText?: string;
  setOpenDialogName: (open: boolean, type: string) => void;
  isDefaultText?: boolean;
  socketId: string;
  postAnonymously: boolean;
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
  postAnonymously,
  setOpenDialogName,
}: OptionsMenuProps) => {
  const [openPopover, setOpenPopover] = useState(false);

  const {
    updateColumn: { mutate: mutateColumn },
    deleteCardsFromColumn: { mutate: mutateBoardCards },
  } = useColumn();

  const {
    updateBoard: { mutate: mutateBoard },
  } = useBoard({ autoFetchBoard: false });

  const {
    board: {
      maxVotes: boardMaxVotes,
      title: boardTitle,
      _id,
      hideCards,
      hideVotes,
      users,
      isPublic,
      columns,
      addCards,
    },
    mainBoard,
  } = useRecoilValue(boardInfoState);

  // State used to change values
  const initialData: UpdateBoardType = {
    _id,
    hideCards,
    hideVotes,
    title: boardTitle,
    maxVotes: boardMaxVotes,
    users,
    isPublic,
    columns,
    addCards,
    postAnonymously,
  };

  const boardData = initialData;

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
    mutateBoardCards({
      id: columnId,
      boardId,
      socketId,
    });
  };

  const handleDeleteColumn = () => {
    setOpenPopover(false);

    const columnsToUpdate = boardData.columns?.filter((column) => {
      if ('_id' in column) return columnId !== column._id;
      return false;
    });
    const deletedColumns = [columnId];

    mutateBoard({
      ...boardData,
      columns: columnsToUpdate,
      responsible: users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE),
      deletedColumns,
      socketId,
      mainBoardId: mainBoard?._id,
    });
  };

  return (
    <>
      <Popover onOpenChange={handleOpenPopover} open={openPopover}>
        <PopoverTrigger css={{ ml: '$8' }} disabled={disabled} size="md" variant="light">
          <Icon name="menu-dots" />
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent>
            <PopoverItem onClick={() => handleOpen('ColumnName')}>
              <Icon name="boards" />
              <Text size="sm">Edit column name </Text>
            </PopoverItem>
            <ConfirmationDialog
              confirmationHandler={handleEmptyColumn}
              confirmationLabel="Empty Column"
              description="Do you really want to remove all cards from this column?"
              title="Empty column of all cards"
              variant="danger"
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
                disabled={cardText === 'Write your comment here...'}
                handleCheckedChange={handleDefaultTextCheck}
                isChecked={!isDefaultText}
              />
            </PopoverItem>
            <ConfirmationDialog
              confirmationHandler={handleDeleteColumn}
              confirmationLabel="Delete Column"
              description="Do you really want to delete this column?"
              title="Delete column"
              variant="danger"
            >
              <PopoverItem>
                <Icon name="trash-alt" />
                <Text size="sm">Delete column</Text>
              </PopoverItem>
            </ConfirmationDialog>
            <Separator css={{ mt: '$5' }} />
            <Flex css={{ pb: '$8', pt: '$20', pl: '$18' }} gap={8}>
              <Text color="primary800" fontWeight="medium" size="xs">
                Cards color
              </Text>
            </Flex>
            <Flex align="center" css={{ pb: '$10', px: '$16' }} direction="row" justify="between">
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
