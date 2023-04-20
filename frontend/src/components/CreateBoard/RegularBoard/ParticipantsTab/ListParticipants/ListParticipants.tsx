import React, { Dispatch, SetStateAction } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import UserListDialog from '@/components/Primitives/Dialogs/UserListDialog/UserListDialog';
import useCurrentSession from '@/hooks/useCurrentSession';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useCreateBoard from '@hooks/useCreateBoard';

type ListParticipantsProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

const ListParticipants = ({ isOpen, setIsOpen }: ListParticipantsProps) => {
  const { userId } = useCurrentSession();

  const [usersList, setUsersList] = useRecoilState(usersListState);
  const setToastState = useSetRecoilState(toastState);
  const {
    createBoardData: { users },
    setCreateBoardData,
  } = useCreateBoard();

  const saveParticipants = (checkedUserList: UserList[]) => {
    const checkedUsersListToBeSorted = [...checkedUserList];
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);

    setUsersList(
      checkedUsersListToBeSorted.sort((a, b) => Number(b.isChecked) - Number(a.isChecked)),
    );

    const addedUsers = selectedUsers
      .filter((user) => !users.some((boardUser) => boardUser.user._id === user._id))
      .map((user) =>
        user._id === userId
          ? { role: BoardUserRoles.RESPONSIBLE, user, votesCount: 0 }
          : {
              role: BoardUserRoles.MEMBER,
              user,
              votesCount: 0,
            },
      );

    const newBoardUsers = [...users, ...addedUsers].filter(
      (boardUser) => !unselectedUsers.some((user) => boardUser?.user._id === user._id),
    );

    // Sort by Name
    newBoardUsers.sort((a, b) => {
      const aFullName = `${a.user.firstName.toLowerCase()} ${a.user.lastName.toLowerCase()}`;
      const bFullName = `${b.user.firstName.toLowerCase()} ${b.user.lastName.toLowerCase()}`;

      return aFullName < bFullName ? -1 : 1;
    });

    // This insures that the board creator stays always in first
    const userAdminIndex = newBoardUsers.findIndex((member) => member.user._id === userId);
    newBoardUsers.unshift(newBoardUsers.splice(userAdminIndex, 1)[0]);

    setCreateBoardData((prev) => ({
      ...prev,
      users: newBoardUsers,
      board: { ...prev.board, team: null },
    }));

    setToastState({
      open: true,
      content: 'Board participant/s successfully updated',
      type: ToastStateEnum.SUCCESS,
    });

    setIsOpen(false);
  };

  return (
    <UserListDialog
      confirmationHandler={saveParticipants}
      confirmationLabel="Add/remove participants"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Board Participants"
      usersList={usersList}
    />
  );
};

export default ListParticipants;
