import Icon from '@/components/icons/Icon';
import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import useUser from '@/hooks/useUser';
import { useSession } from 'next-auth/react';

type DeleteUserProps = { userId: string; firstName: string; lastName: string };

const DeleteUser: React.FC<DeleteUserProps> = ({ userId, firstName, lastName }) => {
  const { data: session } = useSession();

  const loggedUserId = session?.user.id;

  const {
    deleteUser: { mutate },
  } = useUser();

  const handleDeleteUser = () => {
    mutate({ id: userId });
  };

  return (
    <AlertCustomDialog
      cancelText="Cancel"
      confirmText="Delete"
      css={undefined}
      defaultOpen={false}
      text={`Do you really want to delete the user “${firstName} ${lastName}”?`}
      title="Delete User"
      variant="danger"
      handleConfirm={handleDeleteUser}
    >
      {loggedUserId !== userId && (
        <Tooltip content="Delete User">
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
      )}
      {loggedUserId === userId && (
        <Tooltip content="Delete User">
          <Flex pointer>
            <Icon
              name="trash-alt"
              css={{
                color: '$primary400',
                width: '$20',
                height: '$20',
                opacity: 0.3,
              }}
            />
          </Flex>
        </Tooltip>
      )}
    </AlertCustomDialog>
  );
};

export default DeleteUser;
