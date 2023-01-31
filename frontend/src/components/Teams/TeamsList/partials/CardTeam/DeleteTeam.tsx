import Icon from '@/components/icons/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import useTeam from '@/hooks/useTeam';

type DeleteTeamProps = {
  teamName: string;
  teamId: string;
  socketId?: string;
  teamUserId?: string;
  isTeamPage?: boolean | undefined;
};

const DeleteTeam: React.FC<DeleteTeamProps> = ({ teamName, teamId, teamUserId, isTeamPage }) => {
  const { deleteTeam, deleteTeamUser } = useTeam();

  const handleDelete = () => {
    if (isTeamPage) {
      deleteTeam.mutate({ id: teamId });
    } else {
      deleteTeamUser.mutate({ teamUserId });
    }
  };
  return (
    <AlertDialog>
      <Tooltip content="Delete team">
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

      <AlertDialogContent title="Delete team">
        <Text>
          Do you really want to delete the team <Text fontWeight="bold">{teamName}</Text>?
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeam;
