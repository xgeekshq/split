import React, { Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { CreateTeamUser, TeamUserAddAndRemove } from '@/types/team/team.user';
import { useRouter } from 'next/router';
import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import useTeam from '@/hooks/useTeam';
import { UserList } from '@/types/team/userList';
import UserListDialog from '../../../Primitives/Dialogs/UserListDialog/UserListDialog';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  isTeamPage?: boolean;
};

const ListMembers = ({ isOpen, setIsOpen, isTeamPage }: Props) => {
  const {
    addAndRemoveTeamUser: { mutate },
  } = useTeam({ autoFetchTeam: false });

  const router = useRouter();

  const { data: session } = useSession({ required: true });

  const [usersList, setUsersList] = useRecoilState(usersListState);
  const [membersList, setMembersListState] = useRecoilState(membersListState);

  const setToastState = useSetRecoilState(toastState);

  const saveMembers = (checkedUserList: UserList[]) => {
    const listOfUsers = [...membersList];
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);
    const { teamId } = router.query;

    if (isTeamPage && teamId) {
      const team = teamId as string;

      const addedUsers = selectedUsers.filter(
        (user) => !listOfUsers.some((teamUser) => teamUser.user?._id === user._id),
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
          team,
        };
      });

      const removedUsers = listOfUsers.filter((teamUser) =>
        unselectedUsers.some((user) => teamUser.user?._id === user._id),
      );
      const removedUsersIds = removedUsers.map((user) => user._id);
      if (addedUsersToSend.length > 0 || removedUsersIds.length > 0) {
        const usersToUpdate: TeamUserAddAndRemove = {
          addUsers: addedUsersToSend,
          removeUsers: removedUsersIds,
          team,
        };

        mutate(usersToUpdate);
      }

      setIsOpen(false);

      return;
    }

    const updatedListWithAdded = selectedUsers.map((user) => {
      const isNewJoiner = verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt);

      return (
        listOfUsers.find((member) => member.user._id === user._id) || {
          user,
          role: TeamUserRoles.MEMBER,
          isNewJoiner,
          canBeResponsible: !isNewJoiner,
        }
      );
    });

    // Sort by Name
    updatedListWithAdded.sort((a, b) => {
      const aFullName = `${a.user.firstName.toLowerCase()} ${a.user.lastName.toLowerCase()}`;
      const bFullName = `${b.user.firstName.toLowerCase()} ${b.user.lastName.toLowerCase()}`;

      return aFullName < bFullName ? -1 : 1;
    });

    // this insures that the team creator stays always in first
    const userAdminIndex = updatedListWithAdded.findIndex(
      (member) => member.user._id === session?.user.id,
    );

    updatedListWithAdded.unshift(updatedListWithAdded.splice(userAdminIndex, 1)[0]);

    setToastState({
      open: true,
      content: 'Team member/s successfully updated',
      type: ToastStateEnum.SUCCESS,
    });

    setMembersListState(updatedListWithAdded);
    setUsersList(checkedUserList);

    setIsOpen(false);
  };

  return (
    <UserListDialog
      usersList={usersList}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      confirmationHandler={saveMembers}
      title="Team Members"
      confirmationLabel="Add/remove members"
    />
  );
};

export default ListMembers;
