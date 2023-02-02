import React from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import ParticipantCard from './ParticipantCard.tsx';
import ParticipantsLayout from './ParticipantsLayout';

const ParticipantsList = () => {
  const { data: session } = useSession({ required: true });
  // const boardInfo = useRecoilValue(boardInfoState);

  const boardParticipants = useRecoilValue(boardParticipantsState);
  // const boardMembers: BoardUser[] = boardInfo.board.users;

  return (
    <ParticipantsLayout>
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
              isBoardCreator={member.user._id === session?.user.id}
              member={member}
            />
          ))}
        </ScrollableContent>
      </Flex>
    </ParticipantsLayout>
  );
};

export default ParticipantsList;
