import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import useCards from 'hooks/useCards';

type Props = {
  boardId: string;
  socketId?: string;
};
const AlertMergeIntoMain: React.FC<Props> = ({ boardId, socketId }) => {
  const { mergeBoard } = useCards();

  return (
    <AlertCustomDialog
      cancelText="Cancel"
      confirmText="Merge into main board"
      defaultOpen={false}
      text="If you merge your sub-team's board into the main board it can not be edited anymore afterwards. Are you sure you want to merge it?"
      title="Merge board into main board"
      variant="primary"
      handleConfirm={() => {
        mergeBoard.mutate({ subBoardId: boardId, socketId });
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="primaryOutline"
          css={{
            fontWeight: '$medium',
            width: '$206',
          }}
        >
          Merge into main board
        </Button>
      </AlertDialogTrigger>
    </AlertCustomDialog>
  );
};

export default AlertMergeIntoMain;
