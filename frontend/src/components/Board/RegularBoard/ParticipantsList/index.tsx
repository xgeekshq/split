import React from 'react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { useSession } from 'next-auth/react';
import { getGuestUserCookies } from '@/utils/getGuestUserCookies';
import ParticipantsLayout from './ParticipantsLayout';
import ParticipantCard from './ParticipantCard.tsx';

const ParticipantsList = () => {
  const boardParticipants = useRecoilValue(boardParticipantsState);
  const { data: session } = useSession();

  // User Id
  const userId = getGuestUserCookies() ? getGuestUserCookies().user : session?.user.id;

  const isResponsible = !!boardParticipants.find(
    (boardUser) => boardUser.user._id === userId && boardUser.role === BoardUserRoles.RESPONSIBLE,
  );

  const isSAdmin = !!session?.user.isSAdmin;

  const responsiblesList = boardParticipants.filter(
    (boardUser) => boardUser.role === BoardUserRoles.RESPONSIBLE,
  );

  const responsibleSignedUpUsers = responsiblesList.filter(
    (boardUser) => !boardUser.user.isAnonymous,
  );

  const haveInvalidNumberOfResponsibles = responsibleSignedUpUsers.length < 2;

  return (
    <ParticipantsLayout hasPermissionsToEdit={isResponsible || isSAdmin}>
      <Flex direction="column">
        <ScrollableContent
          direction="column"
          gap="8"
          justify="start"
          css={{ height: 'calc(100vh - 35vh)', paddingBottom: '$8' }}
        >
          {boardParticipants?.map((member) => (
            <ParticipantCard
              key={member.user._id}
              member={member}
              isMemberCurrentUser={member.user._id === userId}
              isCurrentUserResponsible={isResponsible}
              isCurrentUserSAdmin={isSAdmin}
              haveInvalidNumberOfResponsibles={haveInvalidNumberOfResponsibles}
              responsibleSignedUpUsers={responsibleSignedUpUsers}
            />
          ))}
        </ScrollableContent>
      </Flex>
    </ParticipantsLayout>
  );
};

export default ParticipantsList;
