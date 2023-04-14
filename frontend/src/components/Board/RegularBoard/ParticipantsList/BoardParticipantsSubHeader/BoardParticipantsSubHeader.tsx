import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import UserListDialog from '@/components/Primitives/Dialogs/UserListDialog/UserListDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import useParticipants from '@/hooks/useParticipants';
import { usersListState } from '@/store/team/atom/team.atom';
import { BoardUser, BoardUserToAdd, UpdateBoardUser } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

type BoardParticipantsSubHeaderProps = {
  hasPermissions: boolean;
  boardParticipants: BoardUser[];
};

const BoardParticipantsSubHeader = ({
  hasPermissions,
  boardParticipants,
}: BoardParticipantsSubHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { query } = useRouter();
  const boardId = query.boardId as string;

  const usersList = useRecoilValue(usersListState);

  const {
    addAndRemoveBoardParticipants: { mutate },
  } = useParticipants();

  const saveParticipants = (checkedUserList: UserList[]) => {
    const listOfUsers = [...boardParticipants];
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);

    const addedUsers = selectedUsers.filter(
      (user) => !listOfUsers.some((boardUser) => boardUser.user._id === user._id),
    );

    const addedBoardUsersToSend: BoardUserToAdd[] = addedUsers.map((user) => ({
      user,
      board: boardId,
      role: BoardUserRoles.MEMBER,
      votesCount: 0,
    }));

    const removedBoardUsers = listOfUsers.filter((boardUser) =>
      unselectedUsers.some((user) => boardUser.user._id === user._id),
    );
    const removedBoardUsersIds: string[] = removedBoardUsers.map(
      (boardUser) => boardUser._id as string,
    );

    if (addedBoardUsersToSend.length > 0 || removedBoardUsersIds.length > 0) {
      const boardUsersToUpdate: UpdateBoardUser = {
        addBoardUsers: addedBoardUsersToSend,
        removeBoardUsers: removedBoardUsersIds,
        boardId,
      };

      mutate(boardUsersToUpdate);
    }

    setIsOpen(false);
  };

  return (
    <Flex css={{ mt: '$32', px: '$150' }} justify="between">
      <Text heading="1">Participants</Text>
      {hasPermissions && (
        <Button onClick={() => setIsOpen(true)} size="sm">
          <Icon css={{ color: 'white' }} name="plus" />
          Add/remove participants
        </Button>
      )}
      <UserListDialog
        confirmationHandler={saveParticipants}
        confirmationLabel="Add/remove participants"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Board Participants"
        usersList={usersList}
      />
    </Flex>
  );
};

export default BoardParticipantsSubHeader;
