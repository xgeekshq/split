import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import BoardParticipantsSubHeader from '@/components/Board/RegularBoard/ParticipantsList/BoardParticipantsSubHeader/BoardParticipantsSubHeader';
import ParticipantCard from '@/components/Board/RegularBoard/ParticipantsList/ParticipantCard';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useParticipants from '@/hooks/useParticipants';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import { BoardUser, UpdateBoardUser } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { getGuestUserCookies } from '@/utils/getGuestUserCookies';

type ParticipantsListProps = {
  createdBy?: string;
};

const ParticipantsList = ({ createdBy }: ParticipantsListProps) => {
  const router = useRouter();
  const boardId = router.query.boardId as string;

  const { data: session } = useSession();
  const userId = getGuestUserCookies() ? getGuestUserCookies().user : session?.user.id;
  const isSAdmin = !!session?.user.isSAdmin;

  const boardParticipants = useRecoilValue(boardParticipantsState);
  const isResponsible = !!boardParticipants.find(
    (boardUser) => boardUser.user._id === userId && boardUser.role === BoardUserRoles.RESPONSIBLE,
  );

  const {
    addAndRemoveBoardParticipants: { mutate },
  } = useParticipants();

  const handleRemoveParticipant = (participantId: string) => {
    if (!participantId) return;

    const boardUsersToUpdate: UpdateBoardUser = {
      addBoardUsers: [],
      removeBoardUsers: [participantId],
      boardId,
    };

    mutate(boardUsersToUpdate);
  };

  const updateIsResponsibleStatus = (checked: boolean, participant: BoardUser) => {
    const boardUserToUpdate: UpdateBoardUser = {
      addBoardUsers: [],
      removeBoardUsers: [],
      boardUserToUpdateRole: {
        ...participant,
        role: checked ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
        board: boardId,
      },
      boardId,
    };
    mutate(boardUserToUpdate);
  };

  return (
    <>
      <BoardParticipantsSubHeader
        boardParticipants={boardParticipants}
        hasPermissions={isResponsible || isSAdmin}
      />
      <Flex
        direction="column"
        css={{
          height: '100%',
          position: 'relative',
          overflowY: 'auto',
          pr: '$8',
          mx: '$150',
          mb: '$24',
        }}
      >
        <Flex direction="column" gap="8">
          {boardParticipants?.map((participant) => (
            <ParticipantCard
              key={participant.user._id}
              handleRemoveParticipant={handleRemoveParticipant}
              isCreatedByCurrentUser={createdBy === participant.user._id}
              isCurrentUserResponsible={isResponsible}
              isCurrentUserSAdmin={isSAdmin}
              isMemberCurrentUser={participant.user._id === userId}
              participant={participant}
              updateIsResponsibleStatus={updateIsResponsibleStatus}
            />
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default ParticipantsList;
