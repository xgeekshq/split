import Flex from '@/components/Primitives/Flex';
import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import Tooltip from '@/components/Primitives/Tooltip';
import Icon from '@/components/icons/Icon';
import { deletedColumnsState, editColumnsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import ColumnType from '@/types/column';
import { DisabledDeleteColumnButton } from './DisabledDeleteButton';

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
    <Flex direction="column">
      <Flex css={{ alignItems: 'center' }}>
        <Flex align="center" css={{ ml: '$24' }} gap="24">
          {disableDeleteColumn ? (
            <DisabledDeleteColumnButton />
          ) : (
            <AlertCustomDialog
              cancelText="Cancel"
              confirmText="Delete"
              css={undefined}
              defaultOpen={false}
              handleConfirm={handleDeleteColumn}
              text={`Do you really want to delete the column ${columnTitle}?`}
              title="Delete column"
            >
              <Tooltip content="Delete column">
                <AlertDialogTrigger asChild>
                  <Flex pointer>
                    <Icon
                      name="trash-alt"
                      css={{
                        color: '$primary400',
                        mt: '$16',
                        size: '$20',
                      }}
                    />
                  </Flex>
                </AlertDialogTrigger>
              </Tooltip>
            </AlertCustomDialog>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export { DeleteColumnButton };
