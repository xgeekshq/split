import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import useBoard from '@/hooks/useBoard';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { UpdateBoardType } from '@/types/board/board';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { useRecoilValue } from 'recoil';

type AlertDeleteColumnProps = {
  socketId: string;
  columnId: string;
  columnTitle: string;
  isOpen: boolean;
  handleDialogChange: (openName: boolean, openDelete: boolean) => void;
};
const AlertDeleteColumn: React.FC<AlertDeleteColumnProps> = ({
  columnId,
  socketId,
  columnTitle,
  isOpen,
  handleDialogChange,
}) => {
  // Recoil State used on [boardId].tsx
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
  };

  const boardData = initialData;

  // Update Board/Column Hook
  const {
    updateBoard: { mutate: mutateBoard },
  } = useBoard({ autoFetchBoard: false });

  const handleDeleteColumn = () => {
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
    });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        title="Merge board into main board"
        handleClose={() => handleDialogChange(false, false)}
      >
        <Text>Do you really want to delete the column &quot;{columnTitle}&quot;?</Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel
            variant="primaryOutline"
            onClick={() => handleDialogChange(false, false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={handleDeleteColumn}>
            Delete Column
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteColumn;
