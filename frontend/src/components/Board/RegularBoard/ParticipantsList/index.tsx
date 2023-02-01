import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
// import Text from '@/components/Primitives/Text';
// import { membersListState } from '@/store/team/atom/team.atom';
// import Icon from '@/components/icons/Icon';
import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
// import { ButtonAddMember } from '@/components/Primitives/Dialog/styles';
import { ListMembers } from '@/components/Teams/CreateTeam/ListMembers';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { BoardUser } from '@/types/board/board.user';
import { Container } from '../../Column/styles';
import ParticipantCard from './ParticipantCard.tsx';
import ParticipantsLayout from './ParticipantsLayout';

const ParticipantsList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession({ required: true });
  // const membersList = useRecoilValue(membersListState);
  const boardInfo = useRecoilValue(boardInfoState);
  const boardMembers: BoardUser[] = boardInfo.board.users;

  // const handleOpen = (event: MouseEvent) => {
  //   event.preventDefault();
  //   setIsOpen(true);
  // };

  return (
    <ParticipantsLayout>
      <Flex css={{ mt: '$20' }} direction="column">
        {/* <Flex>
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
        </Flex> */}
        <Container>
          <ScrollableContent direction="column" justify="start">
            {boardMembers?.map((member) => (
              <ParticipantCard
                key={member.user._id}
                isBoardCreator={member.user._id === session?.user.id}
                member={member}
              />
            ))}
          </ScrollableContent>
        </Container>
        <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
    </ParticipantsLayout>
  );
};

export default ParticipantsList;
