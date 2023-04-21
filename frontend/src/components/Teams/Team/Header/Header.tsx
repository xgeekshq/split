import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';
import { usersListState } from '@/store/user.atom';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { CreateTeamUser, TeamUserAddAndRemove } from '@/types/team/team.user';
import { UserList } from '@/types/team/userList';
import UserListDialog from '@components/Primitives/Dialogs/UserListDialog/UserListDialog';
import useTeam from '@hooks/teams/useTeam';
import useUpdateTeamUsers from '@hooks/teams/useUpdateTeamUsers';
import { TeamUserRoles } from '@utils/enums/team.user.roles';
import { verifyIfIsNewJoiner } from '@utils/verifyIfIsNewJoiner';

export type TeamHeaderProps = {
  title: string;
  hasPermissions: boolean;
};

const TeamHeader = ({ title, hasPermissions }: TeamHeaderProps) => {
  const {
    query: { teamId },
  } = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const usersList = useRecoilValue(usersListState);

  const { data: team } = useTeam(teamId as string);
  const { mutate } = useUpdateTeamUsers(teamId as string);

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    { title: 'Teams', link: ROUTES.Teams },
    { title, isActive: true },
  ];

  const saveMembers = (checkedUserList: UserList[]) => {
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);

    if (!team) return;

    const teamUsers = team.users;

    const addedUsers = selectedUsers.filter(
      (user) => !teamUsers.some((teamUser) => teamUser.user?._id === user._id),
    );

    const addedUsersToSend: CreateTeamUser[] = addedUsers.map((teamUser) => {
      const isNewJoiner = verifyIfIsNewJoiner(teamUser.joinedAt, teamUser.providerAccountCreatedAt);

      return {
        user: teamUser._id,
        role: TeamUserRoles.MEMBER,
        isNewJoiner,
        canBeResponsible: !isNewJoiner,
        team: teamId as string,
      };
    });

    const removedUsers = teamUsers.filter((teamUser) =>
      unselectedUsers.some((user) => teamUser.user?._id === user._id),
    );
    const removedUsersIds = removedUsers.map((user) => user._id);

    if (addedUsersToSend.length > 0 || removedUsersIds.length > 0) {
      const usersToUpdate: TeamUserAddAndRemove = {
        addUsers: addedUsersToSend,
        removeUsers: removedUsersIds,
        team: teamId as string,
      };

      mutate(usersToUpdate);
    }

    setIsOpen(false);
  };

  return (
    <Flex align="center" data-testid="teamHeader" justify="between">
      <Flex css={{ width: '100%' }} direction="column" gap="12">
        <Flex align="center">
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <Flex justify="between">
          <Text heading="1">{title}</Text>
          {hasPermissions && (
            <>
              <Button onClick={handleOpen} size="sm">
                <Icon name="plus" />
                Add / remove members
              </Button>
              <UserListDialog
                confirmationHandler={saveMembers}
                confirmationLabel="Add/remove members"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Team Members"
                usersList={usersList}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TeamHeader;
