import Icon from '@/components/Primitives/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import useBoard from '@/hooks/useBoard';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';

type DeleteBoardProps = {
  boardId: string;
  boardName: string;
  socketId?: string;
  teamId: string;
};

const DeleteBoard: React.FC<DeleteBoardProps> = ({ boardId, boardName, socketId, teamId }) => {
  const { deleteBoard } = useBoard({ autoFetchBoard: false });

  const handleDelete = () => {
    if (teamId) {
      deleteBoard.mutate({ id: boardId, socketId, teamId });
    } else {
      deleteBoard.mutate({ id: boardId });
    }
  };

  return (
    <AlertDialog>
      <Tooltip content="Delete board">
        <AlertDialogTrigger asChild onMouseDown={(e) => e.preventDefault()}>
          <Button isIcon size="sm">
            <Icon
              name="trash-alt"
              css={{
                color: '$primary400',
              }}
            />
          </Button>
        </AlertDialogTrigger>
      </Tooltip>

      <AlertDialogContent title="Delete board">
        <Text>
          Do you really want to delete the board <Text fontWeight="bold">{boardName}</Text>?
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBoard;
