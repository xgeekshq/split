import Icon from '@/components/icons/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import useBoard from '@/hooks/useBoard';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { useRecoilValue } from 'recoil';

type AlertDeleteColumnProps = {
  socketId: string;
  columnId: string;
};
const AlertDeleteColumn: React.FC<AlertDeleteColumnProps> = ({ columnId, socketId }) => {
  // Recoil State used on [boardId].tsx
  const { board } = useRecoilValue(boardInfoState);

  // Update Board/Column Hook
  const {
    updateBoard: { mutate: mutateBoard },
  } = useBoard({ autoFetchBoard: false });

  const handleDeleteColumn = () => {
    const columnsToUpdate = board.columns.filter((column) => columnId !== column._id);
    const deletedColumns = [columnId];

    mutateBoard({ ...board, columns: columnsToUpdate, deletedColumns, socketId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primaryOutline" size="sm">
          Delete column
          <Icon name="merge" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent title="Merge board into main board">
        <Text>Do you really want to delete the column --TITLE?</Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteColumn}>Delete Column</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteColumn;
