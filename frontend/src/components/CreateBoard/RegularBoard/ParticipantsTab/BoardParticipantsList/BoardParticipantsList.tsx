import { MouseEvent, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import ParticipantCard from '@/components/Board/RegularBoard/ParticipantsList/ParticipantCard';
import ListParticipants from '@/components/CreateBoard/RegularBoard/ParticipantsTab/ListParticipants/ListParticipants';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/user.atom';
import { BoardUser } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

const BoardParticipantsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId, isSAdmin } = useCurrentSession();
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);
  const setUsersList = useSetRecoilState(usersListState);

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
        if (user._id !== userId) return user;

        return {
          ...user,
          isChecked: false,
        };
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

  return (
    <Flex css={{ width: '100%' }} direction="column" gap={16}>
      <Flex css={{ mt: '$10' }} justify="end">
        <Button onClick={handleOpen} size="sm" variant="link">
          <Icon name="plus" />
          Add/remove participants
        </Button>
      </Flex>
      <Flex direction="column" gap="8">
        {createBoardData.users.map((participant) => (
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
      <ListParticipants isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
};
export default BoardParticipantsList;
