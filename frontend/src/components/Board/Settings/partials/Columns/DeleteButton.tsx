import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import Icon from '@/components/icons/Icon';
import { deletedColumnsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import { useFormContext } from 'react-hook-form';

interface Props {
  remove: (index?: number | number[]) => void;
  columnTitle: string;
  columnIndex: number;
  disableDeleteColumn?: boolean;
}

const DeleteColumnButton = ({ remove, columnTitle, columnIndex, disableDeleteColumn }: Props) => {
  const { getValues } = useFormContext();
  const [deletedColumns, setDeletedColumns] = useRecoilState(deletedColumnsState);

  const handleDeleteColumn = () => {
    const columnToBeRemoved = [...getValues('formColumns')].at(columnIndex);
    remove(columnIndex);

    if (columnToBeRemoved._id) setDeletedColumns([...deletedColumns, columnToBeRemoved._id]);
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
