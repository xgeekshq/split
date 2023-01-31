import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
// import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import Tooltip from '@/components/Primitives/Tooltip';
import Icon from '@/components/icons/Icon';
import { deletedColumnsState, editColumnsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';


interface Props {
  columnTitle: string;
  columnIndex: number;
  disableDeleteColumn?: boolean;
}

const DeleteColumnButton = ({ columnTitle, columnIndex, disableDeleteColumn }: Props) => {
  const [editColumns, setEditColumns] = useRecoilState(editColumnsState);
  const [deletedColumns, setDeletedColumns] = useRecoilState(deletedColumnsState);
  const handleDeleteColumn = () => {
    const arrayWithoutColumn = [...editColumns];
    const column = arrayWithoutColumn.splice(columnIndex, 1)[0] as ColumnType;
    setEditColumns(arrayWithoutColumn);
    if (column._id) setDeletedColumns([...deletedColumns, column._id]);
  };

  return (
    <AlertDialog>
      <Tooltip
        content={
          disableDeleteColumn ? 'Your board must have at least one column.' : 'Delete column'
        }
      >
        <AlertDialogTrigger asChild onMouseDown={(e) => e.preventDefault()}>
          <Button isIcon disabled={disableDeleteColumn}>
            <Icon
              name="trash-alt"
              css={{
                mt: '$16',
                size: '$20',
              }}
            />
          </Button>
        </AlertDialogTrigger>
      </Tooltip>

      <AlertDialogContent title="Delete column">
        <Text>
          Do you really want to delete the column <Text fontWeight="bold">{columnTitle}</Text>?
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteColumn}>Delete</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteColumnButton };
