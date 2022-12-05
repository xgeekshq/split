import Icon from '@/components/icons/Icon';
import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';

type DeleteUserProps = { userId: string; firstName: string; lastName: string };

const DeleteUser: React.FC<DeleteUserProps> = ({ firstName, lastName }) => (
  <AlertCustomDialog
    cancelText="Cancel"
    confirmText="Delete"
    css={undefined}
    defaultOpen={false}
    text={`Do you really want to delete the user “${firstName} ${lastName}”?`}
    title="Delete User"
  >
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
  </AlertCustomDialog>
);

export default DeleteUser;
