import { useFormContext } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { deletedColumnsState } from '@/store/board/atoms/board.atom';

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
        showCount
        id={`formColumns.${index}.title`}
        maxChars="15"
        placeholder={`Column ${index + 1}`}
        type="text"
      />
      <Flex direction="column">
        <ConfirmationDialog
          confirmationHandler={handleDeleteColumn}
          confirmationLabel="Delete Column"
          description="Do you really want to delete this column?"
          title="Delete column"
          variant="danger"
          tooltip={
            disableDeleteColumn ? 'Your board must have at least one column.' : 'Delete column'
          }
        >
          <Button isIcon disabled={disableDeleteColumn}>
            <Icon css={{ mt: '$16' }} name="trash-alt" size={20} />
          </Button>
        </ConfirmationDialog>
      </Flex>
    </Flex>
  );
};

export { ColumnBoxAndDelete };
