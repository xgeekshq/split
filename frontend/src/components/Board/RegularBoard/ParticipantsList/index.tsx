import React from 'react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { useSession } from 'next-auth/react';
import ParticipantsLayout from './ParticipantsLayout';
import ParticipantCard from './ParticipantCard.tsx';

const ParticipantsList = () => {
  const boardParticipants = useRecoilValue(boardParticipantsState);
  const { data: session } = useSession();

  const isResponsible = !!boardParticipants.find(
    (boardUser) =>
      boardUser.user._id === session?.user.id && boardUser.role === BoardUserRoles.RESPONSIBLE,
  );
  const isSAdmin = !!session?.user.isSAdmin;

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
              isMemberCurrentUser={member.user._id === session?.user.id}
              isCurrentUserResponsible={isResponsible}
              isCurrentUserSAdmin={isSAdmin}
            />
          ))}
        </ScrollableContent>
      </Flex>
    </ParticipantsLayout>
  );
};

export default ParticipantsList;
