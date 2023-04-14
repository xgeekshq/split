import { MouseEvent, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import ParticipantCard from '@/components/Board/RegularBoard/ParticipantsList/ParticipantCard';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';
import { BoardUser } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

import ListParticipants from '@/components/CreateBoard/RegularBoard/ParticipantsTab/ListParticipants/ListParticipants';
import Text from '@/components/Primitives/Text/Text';
import { usersListState } from '@/store/team/atom/team.atom';
import isEmpty from '@/utils/isEmpty';

type BoardParticipantsListProps = {
  isPageLoading: boolean;
};

const BoardParticipantsList = ({ isPageLoading }: BoardParticipantsListProps) => {
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

  const responsibles = createBoardData.users.filter(
    (user) => user.role === BoardUserRoles.RESPONSIBLE,
  );

  return (
    <Flex direction="column" gap={16} css={{ width: '100%' }}>
      <Flex direction="row" justify="between" align="center">
        {isEmpty(responsibles) && !isPageLoading && (
          <Flex css={{ mt: '$10' }}>
            <Icon name="error" size={20} css={{ color: '$dangerBase' }} />
            <Text size="sm" fontWeight="medium" color="dangerBase" css={{ marginLeft: '5px' }}>
              You must select a responsible
            </Text>
          </Flex>
        )}
        <Flex justify="end" css={{ mt: '$10' }}>
          <Button variant="link" size="sm" onClick={handleOpen}>
            <Icon name="plus" />
            Add/remove participants
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="8">
        {createBoardData.users.map((participant) => (
          <ParticipantCard
            key={participant.user._id}
            participant={{ ...participant, _id: participant.user._id }}
            handleRemoveParticipant={handleRemoveParticipant}
            updateIsResponsibleStatus={updateIsResponsibleStatus}
            isMemberCurrentUser={participant.user._id === userId}
            isCurrentUserResponsible
            isCurrentUserSAdmin={!!isSAdmin}
            isCreatedByCurrentUser={userId === participant.user._id}
          />
        ))}
      </Flex>
      <ListParticipants isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
};
export default BoardParticipantsList;
