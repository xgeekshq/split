import { MouseEvent, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import ParticipantCard from '@/components/Board/RegularBoard/ParticipantsList/ParticipantCard';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { createSuccessMessage } from '@/constants/toasts';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import useCurrentSession from '@/hooks/useCurrentSession';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';
import { BoardUser } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import isEmpty from '@/utils/isEmpty';
import UserListDialog from '@components/Primitives/Dialogs/UserListDialog/UserListDialog';
import useCreateBoardHelper from '@hooks/useCreateBoardHelper';

type BoardParticipantsListProps = {
  isPageLoading: boolean;
};

const BoardParticipantsList = ({ isPageLoading }: BoardParticipantsListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId, isSAdmin } = useCurrentSession();
  const {
    createBoardData: { users },
    setCreateBoardData,
  } = useCreateBoardHelper();
  const [usersList, setUsersList] = useRecoilState(usersListState);
  const setToastState = useSetRecoilState(toastState);

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setCreateBoardData((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.user._id !== participantId),
    }));

    setUsersList((prev) =>
      prev.map((user) => {
        if (user._id === userId && !isSAdmin)
          return {
            ...user,
            isChecked: true,
          };

        if (user._id === participantId)
          return {
            ...user,
            isChecked: false,
          };

        return user;
      }),
    );
  };

  const updateIsResponsibleStatus = (checked: boolean, participant: BoardUser) => {
    setCreateBoardData((prev) => ({
      ...prev,
      users: prev.users.map((user) => {
        if (user.user._id !== participant.user._id) return user;

        return {
          ...user,
          role: checked ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
        };
      }),
    }));
  };

  const responsibles = users.filter((user) => user.role === BoardUserRoles.RESPONSIBLE);

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
      team: null,
      users: newBoardUsers,
      board: { ...prev.board, team: null },
    }));

    setToastState(createSuccessMessage('Board participant/s successfully updated'));

    setIsOpen(false);
  };

  return (
    <Flex css={{ width: '100%' }} direction="column" gap={16}>
      <Flex align="center" direction="row" justify="between">
        {isEmpty(responsibles) && !isPageLoading && (
          <Flex css={{ mt: '$10' }}>
            <Icon css={{ color: '$dangerBase' }} name="error" size={20} />
            <Text color="dangerBase" css={{ marginLeft: '$5' }} fontWeight="medium" size="sm">
              You must select a responsible
            </Text>
          </Flex>
        )}
        <Flex css={{ mt: '$10' }} justify="end">
          <Button onClick={handleOpen} size="sm" variant="link">
            <Icon name="plus" />
            Add/remove participants
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="8">
        {users.map((participant) => (
          <ParticipantCard
            key={participant.user._id}
            isCurrentUserResponsible
            handleRemoveParticipant={handleRemoveParticipant}
            isCreatedByCurrentUser={userId === participant.user._id}
            isCurrentUserSAdmin={!!isSAdmin}
            isMemberCurrentUser={participant.user._id === userId}
            participant={{ ...participant, _id: participant.user._id }}
            updateIsResponsibleStatus={updateIsResponsibleStatus}
          />
        ))}
      </Flex>
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
export default BoardParticipantsList;
