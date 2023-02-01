import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import { ListMembers } from '@/components/Teams/CreateTeam/ListMembers';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { BoardUser } from '@/types/board/board.user';
import ParticipantCard from './ParticipantCard.tsx';
import ParticipantsLayout from './ParticipantsLayout';

const ParticipantsList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession({ required: true });
  const boardInfo = useRecoilValue(boardInfoState);
  const boardMembers: BoardUser[] = boardInfo.board.users;

  return (
    <ParticipantsLayout>
      <Flex direction="column">
        <ScrollableContent
          direction="column"
          gap="8"
          justify="start"
          css={{ height: 'calc(100vh - 286px)', paddingBottom: '$8' }}
        >
          {boardMembers?.map((member) => (
            <ParticipantCard
              key={member.user._id}
              isBoardCreator={member.user._id === session?.user.id}
              member={member}
            />
          ))}
        </ScrollableContent>
        <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
    </ParticipantsLayout>
  );
};

export default ParticipantsList;
