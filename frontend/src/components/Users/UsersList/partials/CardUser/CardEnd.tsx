import React from 'react';

import Flex from '@/components/Primitives/Layout/Flex';
import Separator from '@/components/Primitives/Separator';
import { User } from '@/types/user/user';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Button from '@/components/Primitives/Button';
import Icon from '@/components/Primitives/Icon';
import Text from '@/components/Primitives/Text';
import { useSession } from 'next-auth/react';
import useUser from '@/hooks/useUser';
import EditUser from './EditUser';

type CardEndProps = {
  user: User;
};

const CardEnd = React.memo(({ user }: CardEndProps) => {
  const { data: session } = useSession();
  const loggedUserId = session?.user.id;

  const {
    deleteUser: { mutate },
  } = useUser();

  const deleteUserDescription = (
    <Text>
      Do you really want to delete the user{' '}
      <Text fontWeight="bold">
        {user.firstName} {user.lastName}
      </Text>
      ?
    </Text>
  );

  const handleDeleteUser = () => {
    mutate({ id: user._id });
  };

  return (
    <Flex css={{ alignItems: 'center' }}>
      <Separator orientation="vertical" size="lg" css={{ ml: '$20' }} />
      <Flex align="center" css={{ ml: '$24' }} gap="24">
        <EditUser user={user} />
      </Flex>
      <Flex align="center" css={{ ml: '$24' }} gap="24">
        <ConfirmationDialog
          title="Delete user"
          description={deleteUserDescription}
          confirmationHandler={handleDeleteUser}
          confirmationLabel="Delete"
          tooltip="Delete user"
          variant="danger"
        >
          <Button isIcon disabled={loggedUserId === user._id} size="sm">
            <Icon
              name="trash-alt"
              css={{
                color: '$primary400',
              }}
            />
          </Button>
        </ConfirmationDialog>
      </Flex>
    </Flex>
  );
});

export default CardEnd;
