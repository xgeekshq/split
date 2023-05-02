import React from 'react';
import Link from 'next/link';

import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';
import useCurrentSession from '@/hooks/useCurrentSession';
import useDeleteUser from '@/hooks/users/useDeleteUser';
import useUpdateUser from '@/hooks/users/useUpdateUser';
import { UpdateUserIsAdmin, User } from '@/types/user/user';

export type UserItemActionsProps = {
  user: User;
};

const UserItemActions = React.memo(({ user }: UserItemActionsProps) => {
  const { userId } = useCurrentSession();

  const { mutate: updateUserMutation } = useUpdateUser();

  const handleSuperAdminChange = (checked: boolean) => {
    const updateTeamUser: UpdateUserIsAdmin = {
      _id: user._id,
      isSAdmin: checked,
    };

    updateUserMutation(updateTeamUser);
  };

  const { mutate: deleteUserMutation } = useDeleteUser();

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
    deleteUserMutation({ id: user._id });
  };

  return (
    <Flex align="center" css={{ flex: 1 }} data-testid="userItemActions" gap={24} justify="end">
      <ConfigurationSwitch
        disabled={userId === user._id}
        disabledInfo={userId !== user._id ? undefined : "Can't change your own role"}
        handleCheckedChange={handleSuperAdminChange}
        isChecked={user.isSAdmin}
        title="Super Admin"
      />
      <Separator orientation="vertical" size="lg" />
      <Flex align="center">
        <Link href={ROUTES.UserPage(user._id)}>
          <Button isIcon size="sm">
            <Icon
              name="edit"
              css={{
                color: '$primary400',
              }}
            />
          </Button>
        </Link>
      </Flex>
      <Flex align="center">
        <ConfirmationDialog
          confirmationHandler={handleDeleteUser}
          confirmationLabel="Delete"
          description={deleteUserDescription}
          title="Delete user"
          tooltip="Delete user"
          variant="danger"
        >
          <Button isIcon disabled={userId === user._id} size="sm">
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

export default UserItemActions;
