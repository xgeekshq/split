import React, { Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { CreateTeamUser, TeamUserAddAndRemove } from '@/types/team/team.user';
import { useRouter } from 'next/router';
import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import useTeam from '@/hooks/useTeam';
import ListMembersDialog from '../ListMembersDialog';

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

  const usersList = useRecoilValue(usersListState);
  const [membersList, setMembersListState] = useRecoilState(membersListState);

  const setToastState = useSetRecoilState(toastState);

  const saveMembers = () => {
    const listOfUsers = [...membersList];

    const selectedUsers = usersList.filter((user) => user.isChecked);
    const unselectedUsers = usersList.filter((user) => !user.isChecked);
    const { teamId } = router.query;

    if (isTeamPage && teamId) {
      const team = teamId as string;

      const addedUsers = selectedUsers.filter(
        (user) => !listOfUsers.some((teamUser) => teamUser.user._id === user._id),
      );

      const addedUsersToSend: CreateTeamUser[] = addedUsers.map((teamUser) => ({
        user: teamUser._id,
        role: TeamUserRoles.MEMBER,
        isNewJoiner: verifyIfIsNewJoiner(teamUser.joinedAt, teamUser.providerAccountCreatedAt),
        team,
      }));

      const removedUsers = listOfUsers.filter((teamUser) =>
        unselectedUsers.some((user) => teamUser.user._id === user._id),
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

    const updatedListWithAdded = selectedUsers.map(
      (user) =>
        listOfUsers.find((member) => member.user._id === user._id) || {
          user,
          role: TeamUserRoles.MEMBER,
          isNewJoiner: verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt),
        },
    );

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

    setIsOpen(false);
  };

  return (
    <ListMembersDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      saveUsers={saveMembers}
      title="Team Members"
      btnTitle="Add/remove members"
    />
  );
};

export { ListMembers };
