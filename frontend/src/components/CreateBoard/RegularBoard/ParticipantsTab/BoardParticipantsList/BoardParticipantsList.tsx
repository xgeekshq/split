import { MouseEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import ParticipantCard from '@/components/Board/RegularBoard/ParticipantsList/ParticipantCard';
import ListParticipants from '@/components/CreateBoard/RegularBoard/ParticipantsTab/ListParticipants/ListParticipants';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import useCurrentSession from '@/hooks/useCurrentSession';
import { usersListState } from '@/store/user.atom';
import { BoardUser } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import isEmpty from '@/utils/isEmpty';
import useCreateBoard from '@hooks/useCreateBoard';

type BoardParticipantsListProps = {
  isPageLoading: boolean;
};

const BoardParticipantsList = ({ isPageLoading }: BoardParticipantsListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId, isSAdmin } = useCurrentSession();
  const { createBoardData, setCreateBoardData } = useCreateBoard();
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
