import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useSetRecoilState } from 'recoil';

import UserListDialog from '@/components/Primitives/Dialogs/UserListDialog/UserListDialog';
import useTeam from '@/hooks/teams/useTeam';
import useUpdateTeamUsers from '@/hooks/teams/useUpdateTeamUsers';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createTeamState } from '@/store/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';
import { CreateTeamUser, TeamUserAddAndRemove } from '@/types/team/team.user';
import { UserList } from '@/types/team/userList';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';

export type ListMembersProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  isTeamPage?: boolean;
};

const ListMembers = ({ isOpen, setIsOpen, isTeamPage }: ListMembersProps) => {
  const {
    query: { teamId },
  } = useRouter();

  const { userId } = useCurrentSession();
  const { data: team } = useTeam(teamId as string);
  const { mutate } = useUpdateTeamUsers(teamId as string);

  const [usersList, setUsersList] = useRecoilState(usersListState);
  const [createTeamMembers, setCreateTeamMembers] = useRecoilState(createTeamState);

  const setToastState = useSetRecoilState(toastState);

  const saveMembers = (checkedUserList: UserList[]) => {
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);

    if (isTeamPage && teamId && team) {
      const teamUsers = team.users;

      const addedUsers = selectedUsers.filter(
        (user) => !teamUsers.some((teamUser) => teamUser.user?._id === user._id),
      );

      const addedUsersToSend: CreateTeamUser[] = addedUsers.map((teamUser) => {
        const isNewJoiner = verifyIfIsNewJoiner(
          teamUser.joinedAt,
          teamUser.providerAccountCreatedAt,
        );

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
      return;
    }

    // We are Creating a NEW Team
    const updatedListWithAdded = selectedUsers.map((user) => {
      const isNewJoiner = verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt);

      return {
        user,
        role: TeamUserRoles.MEMBER,
        isNewJoiner,
        canBeResponsible: !isNewJoiner,
      };
    });

    // Sort by Name
    updatedListWithAdded.sort((a, b) => {
      const aFullName = `${a.user.firstName.toLowerCase()} ${a.user.lastName.toLowerCase()}`;
      const bFullName = `${b.user.firstName.toLowerCase()} ${b.user.lastName.toLowerCase()}`;

      return aFullName < bFullName ? -1 : 1;
    });

    // this insures that the team creator stays always in first
    const userAdminIndex = updatedListWithAdded.findIndex((member) => member.user._id === userId);

    updatedListWithAdded.unshift(updatedListWithAdded.splice(userAdminIndex, 1)[0]);

    setToastState({
      open: true,
      content: 'Team member/s successfully updated',
      type: ToastStateEnum.SUCCESS,
    });

    setCreateTeamMembers(updatedListWithAdded);
    setUsersList(checkedUserList);

    setIsOpen(false);
  };

  return (
    <UserListDialog
      confirmationHandler={saveMembers}
      confirmationLabel="Add/remove members"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Team Members"
      usersList={usersList}
    />
  );
};

export default ListMembers;
