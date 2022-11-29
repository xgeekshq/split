import Icon from '@/components/icons/Icon';
import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import useTeam from '@/hooks/useTeam';

type DeleteTeamProps = { teamName: string; teamId: string; socketId?: string };

const DeleteTeam: React.FC<DeleteTeamProps> = ({ teamName, teamId }) => {
  const { deleteTeam } = useTeam({ autoFetchTeam: false });
  const handleDelete = () => {
    deleteTeam.mutate({ id: teamId });
  };
  return (
    <AlertCustomDialog
      cancelText="Cancel"
      confirmText="Delete"
      css={undefined}
      defaultOpen={false}
      handleConfirm={handleDelete}
      text={`Do you really want to delete the team “${teamName}”?`}
      title="Delete Team"
    >
      <Tooltip content="Delete Team">
        <AlertDialogTrigger asChild>
          <Flex pointer>
            <Icon
              name="trash-alt"
              css={{
                color: '$primary400',
                width: '$20',
                height: '$20',
              }}
            />
          </Flex>
        </AlertDialogTrigger>
      </Tooltip>
    </AlertCustomDialog>
  );
};

export default DeleteTeam;
