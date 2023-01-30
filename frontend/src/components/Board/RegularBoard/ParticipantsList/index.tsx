import React, { MouseEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import Icon from '@/components/icons/Icon';
import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import { ButtonAddMember } from '@/components/Primitives/Dialog/styles';
import { ListMembers } from '@/components/Teams/CreateTeam/ListMembers';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { BoardUser } from '@/types/board/board.user';
import ParticipantCard from './ParticipantCard.tsx';

const ParticipantsList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession({ required: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const membersList = useRecoilValue(membersListState);
  const boardInfo = useRecoilValue(boardInfoState);
  const boardMembers: BoardUser[] = boardInfo.board.users;

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <Flex css={{ mt: '$20' }} direction="column">
      <Flex>
        <Text css={{ flex: 1 }} heading="3">
          Team Members
        </Text>
        <ButtonAddMember onClick={handleOpen}>
          <Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
          <Text
            weight="medium"
            css={{
              ml: '$10',
              fontSize: '$14',
              lineHeight: '$18',
            }}
          >
            Add/remove members
          </Text>
        </ButtonAddMember>
      </Flex>
      <ScrollableContent direction="column" justify="start">
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
  );
};

export default ParticipantsList;
