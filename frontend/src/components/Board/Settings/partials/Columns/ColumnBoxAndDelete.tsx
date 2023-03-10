import Button from '@/components/Primitives/Button/Button';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Flex from '@/components/Primitives/Layout/Flex';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Input from '@/components/Primitives/Inputs/Input/Input';
import { deletedColumnsState } from '@/store/board/atoms/board.atom';
import { useFormContext } from 'react-hook-form';
import { useRecoilState } from 'recoil';

interface Props {
  remove: (index?: number | number[]) => void;
  index: number;
  disableDeleteColumn?: boolean;
}

const ColumnBoxAndDelete = ({ remove, index, disableDeleteColumn }: Props) => {
  const { getValues } = useFormContext();
  const [deletedColumns, setDeletedColumns] = useRecoilState(deletedColumnsState);

  const handleDeleteColumn = () => {
    const columnToBeRemoved = [...getValues('formColumns')].at(index);
    remove(index);

    if (columnToBeRemoved._id) setDeletedColumns([...deletedColumns, columnToBeRemoved._id]);
  };

  return (
    <Flex gap="20">
      <Input
        id={`formColumns.${index}.title`}
        maxChars="15"
        placeholder={`Column ${index + 1}`}
        showCount
        type="text"
      />
      <Flex direction="column">
        <ConfirmationDialog
          title="Delete column"
          description="Do you really want to delete this column?"
          confirmationLabel="Delete Column"
          variant="danger"
          confirmationHandler={handleDeleteColumn}
          tooltip={
            disableDeleteColumn ? 'Your board must have at least one column.' : 'Delete column'
          }
        >
          <Button isIcon disabled={disableDeleteColumn}>
            <Icon name="trash-alt" size={20} css={{ mt: '$16' }} />
          </Button>
        </ConfirmationDialog>
      </Flex>
    </Flex>
  );
};

export { ColumnBoxAndDelete };
