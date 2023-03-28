import { useSession } from 'next-auth/react';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

import ParticipantCard from '@/components/Board/RegularBoard/ParticipantsList/ParticipantCard';
import { UserList } from '@/types/team/userList';
import { BoardUser } from '@/types/board/board.user';
import ListParticipants from '../ListParticipants/ListParticipants';

const BoardParticipantsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const [usersList, setUsersList] = useRecoilState(usersListState);
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);

  const participants = useMemo(
    () =>
      usersList.flatMap((user) =>
        createBoardData.users.find((member) => user._id === member.user) ? [user] : [],
      ),
    [createBoardData.users, usersList],
  );

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleRemoveParticipant = (userId: string) => {
    setCreateBoardData((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.user !== userId),
    }));
  };

  const updateIsResponsibleStatus = (checked: boolean, participant: BoardUser) => {
    setCreateBoardData((prev) => ({
      ...prev,
      users: prev.users.map((user) => {
        if (user.user !== participant._id) return user;

        return {
          ...user,
          role: checked ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
        };
      }),
    }));
  };

  useEffect(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === session?.user.id || user.isChecked,
    }));

    const users = updateCheckedUser.flatMap((user) =>
      user.isChecked
        ? [
            {
              role:
                user._id === session?.user.id ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
              user: user._id,
              votesCount: 0,
            },
          ]
        : [],
    );
    setUsersList(updateCheckedUser);

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, team: null },
    }));
  }, []);

  return (
    <Flex direction="column" gap={16} css={{ width: '100%' }}>
      <Flex justify="end" css={{ mt: '$10' }}>
        <Button variant="link" size="sm" onClick={handleOpen}>
          <Icon name="plus" />
          Add/remove participants
        </Button>
      </Flex>
      <Flex direction="column" gap="8">
        {createBoardData.users.map((participant) => (
          <ParticipantCard
            key={participant.user}
            participant={{
              ...participant,
              _id: participant.user,
              user: participants.find((user) => user._id === participant.user) as UserList,
              votesCount: 0,
            }}
            handleRemoveParticipant={handleRemoveParticipant}
            updateIsResponsibleStatus={updateIsResponsibleStatus}
            isMemberCurrentUser={participant.user === session?.user.id}
            isCurrentUserResponsible
            isCurrentUserSAdmin={!!session?.user.isSAdmin}
            isCreatedByCurrentUser={session?.user.id === participant.user}
          />
        ))}
      </Flex>
      <ListParticipants isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
};
export default BoardParticipantsList;
