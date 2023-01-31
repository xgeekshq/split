import Icon from '@/components/icons/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
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
    <AlertDialog>
      <Tooltip content="Delete user">
        <AlertDialogTrigger asChild onMouseDown={(e) => e.preventDefault()}>
          <Button isIcon disabled={loggedUserId === userId} size="sm">
            <Icon
              name="trash-alt"
              css={{
                color: '$primary400',
                size: '$20',
              }}
            />
          </Button>
        </AlertDialogTrigger>
      </Tooltip>

      <AlertDialogContent title="Delete user">
        <Text>
          Do you really want to delete the user{' '}
          <Text fontWeight="bold">
            {firstName} {lastName}
          </Text>
          ?
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={handleDeleteUser}>
            Delete
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUser;
